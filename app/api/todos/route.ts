import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTodoSchema } from "@/lib/types/todo";
import type { ApiResponse } from "@/lib/types/todo";

/**
 * GET /api/todos - 全てのTodoを取得（検索・フィルター・ソート対応）
 * Query Parameters:
 * - q: 検索キーワード（タイトル・説明を部分一致検索）
 * - completed: 完了状態でフィルター（true/false）
 * - priority: 優先度でフィルター（low/medium/high）
 * - sortBy: ソート項目（createdAt/updatedAt/title/priority）
 * - sortOrder: ソート順（asc/desc）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.toLowerCase();
    const completedFilter = searchParams.get("completed");
    const priorityFilter = searchParams.get("priority");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Prismaのwhere条件を構築
    const where: any = {};

    // 検索キーワードでフィルター
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ];
    }

    // 完了状態でフィルター
    if (completedFilter !== null) {
      where.completed = completedFilter === "true";
    }

    // 優先度でフィルター
    if (priorityFilter) {
      where.priority = priorityFilter;
    }

    // ソート条件を構築
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // データベースから取得
    const todos = await prisma.todo.findMany({
      where,
      orderBy,
    });

    const response: ApiResponse<typeof todos> = {
      data: todos,
      message: "Todos fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos - 新しいTodoを作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validated = createTodoSchema.parse(body);

    // データベースに保存
    const newTodo = await prisma.todo.create({
      data: {
        title: validated.title,
        description: validated.description,
        priority: validated.priority,
      },
    });

    const response: ApiResponse<typeof newTodo> = {
      data: newTodo,
      message: "Todo created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Validation failed", message: error.message },
        { status: 400 }
      );
    }
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
