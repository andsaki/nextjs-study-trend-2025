"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
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

const fetcher = async (url: string): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const urlObj = new URL(url, "http://localhost");
      const status = urlObj.searchParams.get("status");

      if (!status || status === "all") {
        resolve(mockItems);
      } else {
        resolve(mockItems.filter((item) => item.status === status));
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

export function SWRDemo({ demoType }: { demoType: DemoType }) {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: items, isLoading, mutate } = useSWR("/api/swr-items", fetcher);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setError(null);
    setIsSuccess(false);

    try {
      await deleteItem(id);
      mutate();
      setIsSuccess(true);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsDeleting(false);
    }
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
          <strong>isDeleting:</strong> {String(isDeleting)}
        </Text>
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>isError:</strong> {String(!!error)}
        </Text>
        <Text variant="body-small">
          <strong>isSuccess:</strong> {String(isSuccess)}
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
                onClick={() => handleDelete(item.id)}
                disabled={isDeleting}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
                  backgroundColor: isDeleting ? colors.border.default : colors.button.danger.bg,
                  color: "white",
                  border: "none",
                  borderRadius: radii.button.md,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ loading/error/success状態を<strong>手動で管理</strong>する必要がある
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

  // URL文字列を構築
  const url = `/api/swr-items?status=${status}`;
  const { data: items, isLoading, isValidating } = useSWR(url, fetcher);

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
          <strong>現在のブラウザURL:</strong> ?status={status}
        </Text>
        <Text variant="body-small" style={{ marginBottom: spacing.scale[2] }}>
          <strong>SWRのキー:</strong> {url}
        </Text>
        <Text variant="body-small">
          <strong>isValidating:</strong> {String(isValidating)}
        </Text>
      </div>

      <div style={{ display: "flex", gap: spacing.scale[3], marginBottom: spacing.scale[6] }}>
        <button
          onClick={() => setStatus("all")}
          style={{
            padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
            backgroundColor: status === "all" ? colors.feedback.info.icon : colors.border.default,
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
              status === "active" ? colors.feedback.info.icon : colors.border.default,
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
              status === "completed" ? colors.feedback.info.icon : colors.border.default,
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
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ URL文字列を<strong>手動で構築</strong>する必要がある
        </Text>
      </div>
    </div>
  );
}

// 3. キャッシュ無効化デモ
function CacheDemo() {
  const { mutate } = useSWRConfig();

  const { data: allItems } = useSWR("/api/swr-items", fetcher);
  const { data: activeItems } = useSWR("/api/swr-items?status=active", fetcher);
  const { data: completedItems } = useSWR("/api/swr-items?status=completed", fetcher);

  const handleInvalidate = () => {
    // 個別にmutateを呼ぶ必要がある
    mutate("/api/swr-items");
    mutate("/api/swr-items?status=active");
    mutate("/api/swr-items?status=completed");
  };

  return (
    <div>
      <button
        onClick={handleInvalidate}
        style={{
          padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
          backgroundColor: colors.feedback.info.icon,
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
            /api/swr-items
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
            /api/swr-items?status=active
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
            /api/swr-items?status=completed
          </Text>
          <Text variant="body-small">{completedItems?.length || 0}件</Text>
        </div>
      </div>

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ URL個別にmutateを呼ぶか、<strong>関数で前方一致</strong>させる必要がある
        </Text>
      </div>
    </div>
  );
}

// 4. 楽観的更新デモ
function OptimisticDemo() {
  const [updateCount, setUpdateCount] = useState(0);

  const { data: items, isLoading, mutate } = useSWR("/api/swr-optimistic-items", fetcher);

  const handleUpdate = async (id: number) => {
    if (!items) return;

    // 楽観的更新を手動で実装
    const optimisticData = items.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "active" ? "completed" : "active" }
        : item
    );

    try {
      await mutate(
        // API呼び出しをシミュレート
        new Promise<Item[]>((resolve) => {
          setTimeout(() => {
            const updated = items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: (item.status === "active" ? "completed" : "active") as Item["status"],
                  }
                : item
            );
            resolve(updated);
          }, 1500);
        }),
        {
          optimisticData,
          rollbackOnError: true,
        }
      );
      setUpdateCount((c) => c + 1);
    } catch (error) {
      console.error(error);
    }
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
          <strong>更新回数:</strong> {updateCount}
        </Text>
        <Text variant="body-small">
          <strong>ポイント:</strong> optimisticData を手動で構築する必要がある
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
                onClick={() => handleUpdate(item.id)}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
                  backgroundColor: colors.feedback.info.icon,
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
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ optimisticData を<strong>手動で構築</strong>し、mutate の第2引数に渡す必要がある
        </Text>
      </div>
    </div>
  );
}

// 5. ウィンドウフォーカス時の再取得デモ
function RefetchDemo() {
  const [lastFetchTime, setLastFetchTime] = useState<string>("");

  const { data: items, isLoading } = useSWR("/api/swr-refetch-items", async (url: string) => {
    const now = new Date().toLocaleTimeString("ja-JP");
    setLastFetchTime(now);
    return fetcher(url);
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
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ <strong>revalidateOnFocus</strong>
          も同様の機能を持つが、React Queryほど細かい制御はできない
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

// モックデータ（React Queryと同じ）
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

// モックAPI（同じ遅延を持つ）
const swrFetcher = async (url: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (url === "/api/swr-regions") {
    return mockRegions;
  }

  const urlObj = new URL(url, "http://localhost");
  const region = urlObj.searchParams.get("region");
  const prefecture = urlObj.searchParams.get("prefecture");
  const city = urlObj.searchParams.get("city");

  if (region) {
    return mockPrefectures.filter((p) => p.regionId === region);
  }

  if (prefecture) {
    return mockCities.filter((c) => c.prefectureId === prefecture);
  }

  if (city) {
    return mockOffices.filter((o) => o.cityId === city);
  }

  return [];
};

function DependentDemo() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedOffice, setSelectedOffice] = useState<string>("");

  // 1階層目: 地域
  const { data: regions, isLoading: regionsLoading } = useSWR("/api/swr-regions", swrFetcher);

  // 2階層目: 都道府県（手動でURL構築 + null チェック）
  const prefecturesUrl = selectedRegion ? `/api/swr-prefectures?region=${selectedRegion}` : null;
  const { data: prefectures, isLoading: prefecturesLoading } = useSWR(prefecturesUrl, swrFetcher);

  // 3階層目: 市区町村（手動でURL構築 + null チェック）
  const citiesUrl = selectedPrefecture
    ? `/api/swr-cities?prefecture=${selectedPrefecture}`
    : null;
  const { data: cities, isLoading: citiesLoading } = useSWR(citiesUrl, swrFetcher);

  // 4階層目: 事業所（手動でURL構築 + null チェック）
  const officesUrl = selectedCity ? `/api/swr-offices?city=${selectedCity}` : null;
  const { data: offices, isLoading: officesLoading } = useSWR(officesUrl, swrFetcher);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedPrefecture("");
    setSelectedCity("");
    setSelectedOffice("");
  };

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefecture(e.target.value);
    setSelectedCity("");
    setSelectedOffice("");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setSelectedOffice("");
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
          <strong>ポイント:</strong> URL を手動で構築し、null
          チェックで依存関係を表現する必要がある
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
            {regions?.map((region: Region) => (
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
            {prefectures?.map((prefecture: Prefecture) => (
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
            {cities?.map((city: City) => (
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
            {offices?.map((office: Office) => (
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
            ✅ 選択完了:{" "}
            {offices?.find((o: Office) => o.id === selectedOffice)?.name}
          </Text>
        </div>
      )}

      <div
        style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: "#fff3e0",
          borderRadius: radii.input.md,
        }}
      >
        <Text variant="body-small">
          ⚠️ URL文字列を<strong>手動で構築</strong>し、null
          で依存関係を表現。冗長になりやすい
        </Text>
      </div>
    </div>
  );
}
