"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, radii } from "@/src/design-system/tokens";

type Item = {
  id: number;
  name: string;
  status: "all" | "active" | "completed";
};

// モックAPI
const mockItems: Item[] = [
  { id: 1, name: "タスク1", status: "active" },
  { id: 2, name: "タスク2", status: "completed" },
  { id: 3, name: "タスク3", status: "active" },
];

const getItems = (params?: { status: string }): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!params || params.status === "all") {
        resolve(mockItems);
      } else {
        resolve(mockItems.filter((item) => item.status === params.status));
      }
    }, 500);
  });
};

const deleteItem = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        mockItems.splice(index, 1);
      }
      resolve();
    }, 800);
  });
};

type DemoType = "mutation" | "params" | "cache" | "optimistic" | "refetch" | "dependent";

export function ReactQueryDemo({ demoType }: { demoType: DemoType }) {
  if (demoType === "mutation") {
    return <MutationDemo />;
  }
  if (demoType === "params") {
    return <ParamsDemo />;
  }
  if (demoType === "cache") {
    return <CacheDemo />;
  }
  if (demoType === "optimistic") {
    return <OptimisticDemo />;
  }
  if (demoType === "refetch") {
    return <RefetchDemo />;
  }
  return <DependentDemo />;
}

// 1. Mutation管理デモ
function MutationDemo() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["rq-items"],
    queryFn: () => getItems(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rq-items"] });
    },
  });

  return (
    <div>
      <div
        style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.input.md,
          marginBottom: spacing.scale[4],
        }}
      >
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>isPending:</strong> {String(deleteMutation.isPending)}
        </Text>
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>isError:</strong> {String(deleteMutation.isError)}
        </Text>
        <Text variant="body-small">
          <strong>isSuccess:</strong> {String(deleteMutation.isSuccess)}
        </Text>
      </div>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[3] }}>
          {items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: spacing.scale[3],
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.input.md,
              }}
            >
              <Text>{item.name}</Text>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                disabled={deleteMutation.isPending}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
                  backgroundColor: deleteMutation.isPending
                    ? colors.border.default
                    : colors.button.danger.bg,
                  color: "white",
                  border: "none",
                  borderRadius: radii.button.md,
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                }}
              >
                {deleteMutation.isPending ? "削除中..." : "削除"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ isPending, isError, isSuccessが<strong>自動で管理</strong>される
        </Text>
      </div>
    </div>
  );
}

// 2. 検索パラメータデモ
function ParamsDemo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") as "all" | "active" | "completed") || "all";

  const params = { status };

  const { data: items, isLoading, isFetching } = useQuery({
    queryKey: ["rq-items", params],
    queryFn: () => getItems(params),
  });

  const setStatus = (newStatus: "all" | "active" | "completed") => {
    const current = new URLSearchParams(searchParams.toString());
    current.set("status", newStatus);
    router.push(`?${current.toString()}`);
  };

  return (
    <div>
      <div
        style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.input.md,
          marginBottom: spacing.scale[4],
        }}
      >
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>現在のURL:</strong> ?status={status}
        </Text>
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>現在のqueryKey:</strong> ["rq-items", {`{status: "${params.status}"}`}]
        </Text>
        <Text variant="body-small">
          <strong>isFetching:</strong> {String(isFetching)}
        </Text>
      </div>

      <div style={{ display: "flex", gap: spacing.scale[3], marginBottom: spacing.scale[6] }}>
        <button
          onClick={() => setStatus("all")}
          style={{
            padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
            backgroundColor: status === "all" ? colors.brand.primary : colors.border.default,
            color: status === "all" ? "white" : colors.text.primary,
            border: "none",
            borderRadius: radii.button.md,
            cursor: "pointer",
          }}
        >
          すべて
        </button>
        <button
          onClick={() => setStatus("active")}
          style={{
            padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
            backgroundColor:
              status === "active" ? colors.brand.primary : colors.border.default,
            color: status === "active" ? "white" : colors.text.primary,
            border: "none",
            borderRadius: radii.button.md,
            cursor: "pointer",
          }}
        >
          進行中
        </button>
        <button
          onClick={() => setStatus("completed")}
          style={{
            padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
            backgroundColor:
              status === "completed" ? colors.brand.primary : colors.border.default,
            color: status === "completed" ? "white" : colors.text.primary,
            border: "none",
            borderRadius: radii.button.md,
            cursor: "pointer",
          }}
        >
          完了
        </button>
      </div>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[3] }}>
          {items?.map((item) => (
            <div
              key={item.id}
              style={{
                padding: spacing.scale[3],
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.input.md,
              }}
            >
              <Text>
                {item.name} ({item.status})
              </Text>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ queryKeyにparamsを含めるだけで<strong>自動再フェッチ</strong>
        </Text>
      </div>
    </div>
  );
}

// 3. キャッシュ無効化デモ
function CacheDemo() {
  const queryClient = useQueryClient();

  const { data: allItems } = useQuery({
    queryKey: ["rq-items"],
    queryFn: () => getItems(),
  });

  const { data: activeItems } = useQuery({
    queryKey: ["rq-items", { status: "active" }],
    queryFn: () => getItems({ status: "active" }),
  });

  const { data: completedItems } = useQuery({
    queryKey: ["rq-items", { status: "completed" }],
    queryFn: () => getItems({ status: "completed" }),
  });

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["rq-items"] });
  };

  return (
    <div>
      <button
        onClick={handleInvalidate}
        style={{
          padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
          backgroundColor: colors.brand.primary,
          color: "white",
          border: "none",
          borderRadius: radii.button.md,
          cursor: "pointer",
          marginBottom: spacing.scale[6],
          width: "100%",
        }}
      >
        すべてのキャッシュを無効化
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[4] }}>
        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.input.md,
          }}
        >
          <Text variant="body-small" style={{ fontWeight: 600, marginBottom: spacing.scale[2] }}>
            ["rq-items"]
          </Text>
          <Text variant="body-small">{allItems?.length || 0}件</Text>
        </div>

        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.input.md,
          }}
        >
          <Text variant="body-small" style={{ fontWeight: 600, marginBottom: spacing.scale[2] }}>
            {`["rq-items", {status: "active"}]`}
          </Text>
          <Text variant="body-small">{activeItems?.length || 0}件</Text>
        </div>

        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.input.md,
          }}
        >
          <Text variant="body-small" style={{ fontWeight: 600, marginBottom: spacing.scale[2] }}>
            {`["rq-items", {status: "completed"}]`}
          </Text>
          <Text variant="body-small">{completedItems?.length || 0}件</Text>
        </div>
      </div>

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ invalidateQueries({`{queryKey: ["rq-items"]}`})で
          <strong>関連する全キャッシュを一括無効化</strong>
        </Text>
      </div>
    </div>
  );
}

// 4. 楽観的更新デモ
function OptimisticDemo() {
  const queryClient = useQueryClient();
  const [updateCount, setUpdateCount] = useState(0);

  const { data: items, isLoading } = useQuery({
    queryKey: ["rq-optimistic-items"],
    queryFn: () => getItems(),
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const item = mockItems.find((i) => i.id === id);
          if (item) {
            item.status = item.status === "active" ? "completed" : "active";
          }
          resolve();
        }, 1500);
      });
    },
    onMutate: async (id) => {
      // 即座にUIを更新（楽観的更新）
      await queryClient.cancelQueries({ queryKey: ["rq-optimistic-items"] });

      const previousItems = queryClient.getQueryData<Item[]>(["rq-optimistic-items"]);

      queryClient.setQueryData<Item[]>(["rq-optimistic-items"], (old) =>
        old
          ? old.map((item) =>
              item.id === id
                ? { ...item, status: item.status === "active" ? "completed" : "active" }
                : item
            )
          : []
      );

      return { previousItems };
    },
    onError: (err, id, context) => {
      // エラー時はロールバック
      queryClient.setQueryData(["rq-optimistic-items"], context?.previousItems);
    },
    onSuccess: () => {
      setUpdateCount((c) => c + 1);
    },
  });

  return (
    <div>
      <div
        style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.input.md,
          marginBottom: spacing.scale[4],
        }}
      >
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>更新回数:</strong> {updateCount}
        </Text>
        <Text variant="body-small">
          <strong>ポイント:</strong> クリック直後にUIが更新される（1.5秒後にAPIが完了）
        </Text>
      </div>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[3] }}>
          {items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: spacing.scale[3],
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.input.md,
                backgroundColor:
                  item.status === "completed"
                    ? colors.feedback.success.bg
                    : colors.background.default,
              }}
            >
              <Text>
                {item.name} - <strong>{item.status}</strong>
              </Text>
              <button
                onClick={() => updateMutation.mutate(item.id)}
                disabled={updateMutation.isPending}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
                  backgroundColor: colors.brand.primary,
                  color: "white",
                  border: "none",
                  borderRadius: radii.button.md,
                  cursor: "pointer",
                }}
              >
                切り替え
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ <strong>setQueryData</strong>
          で即座にUIを更新。エラー時は自動ロールバック
        </Text>
      </div>
    </div>
  );
}

// 5. ウィンドウフォーカス時の再取得デモ
function RefetchDemo() {
  const [lastFetchTime, setLastFetchTime] = useState<string>("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["rq-refetch-items"],
    queryFn: async () => {
      const now = new Date().toLocaleTimeString("ja-JP");
      setLastFetchTime(now);
      return getItems();
    },
    refetchOnWindowFocus: true, // デフォルトで有効
  });

  return (
    <div>
      <div
        style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.input.md,
          marginBottom: spacing.scale[4],
        }}
      >
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>最後の取得時刻:</strong> {lastFetchTime || "未取得"}
        </Text>
        <Text variant="body-small">
          <strong>試してみよう:</strong> 別タブに移動してから戻ってくると自動で再取得されます
        </Text>
      </div>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[3] }}>
          {items?.map((item) => (
            <div
              key={item.id}
              style={{
                padding: spacing.scale[3],
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.input.md,
              }}
            >
              <Text>
                {item.name} ({item.status})
              </Text>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ <strong>refetchOnWindowFocus</strong>
          で常に最新データを保持（デフォルト有効）
        </Text>
      </div>
    </div>
  );
}

// 6. 依存クエリ（4階層）デモ
type Region = { id: string; name: string };
type Prefecture = { id: string; name: string; regionId: string };
type City = { id: string; name: string; prefectureId: string };
type Office = { id: string; name: string; cityId: string };

// モックデータ
const mockRegions: Region[] = [
  { id: "kanto", name: "関東" },
  { id: "kansai", name: "関西" },
  { id: "chubu", name: "中部" },
];

const mockPrefectures: Prefecture[] = [
  { id: "tokyo", name: "東京都", regionId: "kanto" },
  { id: "kanagawa", name: "神奈川県", regionId: "kanto" },
  { id: "saitama", name: "埼玉県", regionId: "kanto" },
  { id: "osaka", name: "大阪府", regionId: "kansai" },
  { id: "kyoto", name: "京都府", regionId: "kansai" },
  { id: "aichi", name: "愛知県", regionId: "chubu" },
];

const mockCities: City[] = [
  { id: "shibuya", name: "渋谷区", prefectureId: "tokyo" },
  { id: "shinjuku", name: "新宿区", prefectureId: "tokyo" },
  { id: "yokohama", name: "横浜市", prefectureId: "kanagawa" },
  { id: "kawasaki", name: "川崎市", prefectureId: "kanagawa" },
  { id: "saitama-city", name: "さいたま市", prefectureId: "saitama" },
  { id: "osaka-city", name: "大阪市", prefectureId: "osaka" },
  { id: "kyoto-city", name: "京都市", prefectureId: "kyoto" },
  { id: "nagoya", name: "名古屋市", prefectureId: "aichi" },
];

const mockOffices: Office[] = [
  { id: "shibuya-1", name: "渋谷本社", cityId: "shibuya" },
  { id: "shibuya-2", name: "渋谷支社", cityId: "shibuya" },
  { id: "shinjuku-1", name: "新宿オフィス", cityId: "shinjuku" },
  { id: "yokohama-1", name: "横浜営業所", cityId: "yokohama" },
  { id: "osaka-1", name: "大阪本社", cityId: "osaka-city" },
  { id: "kyoto-1", name: "京都支店", cityId: "kyoto-city" },
  { id: "nagoya-1", name: "名古屋支店", cityId: "nagoya" },
];

// モックAPI
const getRegions = (): Promise<Region[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRegions), 300);
  });
};

const getPrefectures = (regionId: string): Promise<Prefecture[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrefectures.filter((p) => p.regionId === regionId));
    }, 500);
  });
};

const getCities = (prefectureId: string): Promise<City[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCities.filter((c) => c.prefectureId === prefectureId));
    }, 500);
  });
};

const getOffices = (cityId: string): Promise<Office[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOffices.filter((o) => o.cityId === cityId));
    }, 500);
  });
};

function DependentDemo() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedOffice, setSelectedOffice] = useState<string>("");

  // 1階層目: 地域（React Query: useQuery）
  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ["rq-regions"], // 嬉しさ: 配列でキーを管理、階層的に整理しやすい
    queryFn: getRegions,
  });

  // 2階層目: 都道府県（React Query: useQuery + enabled で依存関係を宣言）
  const { data: prefectures, isLoading: prefecturesLoading } = useQuery({
    queryKey: ["rq-prefectures", selectedRegion], // 嬉しさ: selectedRegionが変わると自動で新しいキャッシュキーになる
    queryFn: () => getPrefectures(selectedRegion),
    enabled: selectedRegion.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
  });

  // 3階層目: 市区町村（React Query: useQuery + enabled で依存関係を宣言）
  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ["rq-cities", selectedPrefecture], // 嬉しさ: selectedPrefectureが変わると自動で新しいキャッシュキーになる
    queryFn: () => getCities(selectedPrefecture),
    enabled: selectedPrefecture.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
  });

  // 4階層目: 事業所（React Query: useQuery + enabled で依存関係を宣言）
  const { data: offices, isLoading: officesLoading } = useQuery({
    queryKey: ["rq-offices", selectedCity], // 嬉しさ: selectedCityが変わると自動で新しいキャッシュキーになる
    queryFn: () => getOffices(selectedCity),
    enabled: selectedCity.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
  });

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedPrefecture("");
    setSelectedCity("");
    setSelectedOffice("");
    // React Query: queryKeyが変わるだけで古いキャッシュは自動破棄される
    // mutateやinvalidateを呼ぶ必要なし！
  };

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefecture(e.target.value);
    setSelectedCity("");
    setSelectedOffice("");
    // React Query: queryKeyが変わるだけで古いキャッシュは自動破棄される
    // mutateやinvalidateを呼ぶ必要なし！
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setSelectedOffice("");
    // React Query: queryKeyが変わるだけで古いキャッシュは自動破棄される
    // mutateやinvalidateを呼ぶ必要なし！
  };

  return (
    <div>
      <div
        style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.input.md,
          marginBottom: spacing.scale[4],
        }}
      >
        <Text variant="body-small">
          <strong>ポイント:</strong> enabled で依存関係を宣言的に管理。親が選択されたら自動で子を取得
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[4] }}>
        {/* 1階層目: 地域 */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: spacing.scale[2],
              fontWeight: 600,
            }}
          >
            地域 {regionsLoading && "（読み込み中...）"}
          </label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            disabled={regionsLoading}
            style={{
              width: "100%",
              padding: spacing.scale[3],
              borderRadius: radii.input.md,
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <option value="">選択してください</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2階層目: 都道府県 */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: spacing.scale[2],
              fontWeight: 600,
            }}
          >
            都道府県 {prefecturesLoading && "（読み込み中...）"}
          </label>
          <select
            value={selectedPrefecture}
            onChange={handlePrefectureChange}
            disabled={!selectedRegion || prefecturesLoading}
            style={{
              width: "100%",
              padding: spacing.scale[3],
              borderRadius: radii.input.md,
              border: `1px solid ${colors.border.default}`,
              opacity: !selectedRegion ? 0.5 : 1,
            }}
          >
            <option value="">選択してください</option>
            {prefectures?.map((prefecture) => (
              <option key={prefecture.id} value={prefecture.id}>
                {prefecture.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3階層目: 市区町村 */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: spacing.scale[2],
              fontWeight: 600,
            }}
          >
            市区町村 {citiesLoading && "（読み込み中...）"}
          </label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedPrefecture || citiesLoading}
            style={{
              width: "100%",
              padding: spacing.scale[3],
              borderRadius: radii.input.md,
              border: `1px solid ${colors.border.default}`,
              opacity: !selectedPrefecture ? 0.5 : 1,
            }}
          >
            <option value="">選択してください</option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4階層目: 事業所 */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: spacing.scale[2],
              fontWeight: 600,
            }}
          >
            事業所 {officesLoading && "（読み込み中...）"}
          </label>
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            disabled={!selectedCity || officesLoading}
            style={{
              width: "100%",
              padding: spacing.scale[3],
              borderRadius: radii.input.md,
              border: `1px solid ${colors.border.default}`,
              opacity: !selectedCity ? 0.5 : 1,
            }}
          >
            <option value="">選択してください</option>
            {offices?.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOffice && (
        <div
          style={{
            marginTop: spacing.scale[6],
            padding: spacing.scale[4],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.input.md,
          }}
        >
          <Text variant="body-small">
            ✅ 選択完了: {offices?.find((o) => o.id === selectedOffice)?.name}
          </Text>
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#e8f5e9",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ✅ <strong>enabled</strong>
          で依存関係を宣言的に管理。各階層のローディング状態も自動管理
        </Text>
      </div>
    </div>
  );
}
