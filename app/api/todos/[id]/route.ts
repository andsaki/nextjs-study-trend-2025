import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTodoSchema } from "@/lib/types/todo";
import type { ApiResponse } from "@/lib/types/todo";

/**
 * GET /api/todos/[id] - IDでTodoを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json(
        { error: "Not found", message: "Todo not found" },
        { status: 404 }
      );
    }

    const response: ApiResponse<typeof todo> = {
      data: todo,
      message: "Todo fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/todos/[id] - Todoを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateTodoSchema.parse(body);

    // データベースで更新
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: validated,
    });

    const response: ApiResponse<typeof updatedTodo> = {
      data: updatedTodo,
      message: "Todo updated successfully",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Not found", message: "Todo not found" },
        { status: 404 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Validation failed", message: error.message },
        { status: 400 }
      );
    }
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos/[id] - Todoを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Not found", message: "Todo not found" },
        { status: 404 }
      );
    }
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
