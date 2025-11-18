// Server Component - サーバーで実行される
// このコンポーネントは毎回サーバーで再レンダリングされる

export async function ServerComponent() {
  // サーバーでのみ実行可能な処理（例：データベースアクセス）
  const serverTime = new Date().toISOString();

  // 擬似的なデータベース呼び出し
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = {
    message: "このデータはサーバーで取得されました",
    fetchedAt: serverTime,
    randomNumber: Math.floor(Math.random() * 1000)
  };

  return (
    <div style={{
      padding: "1rem",
      border: "2px solid #3b82f6",
      borderRadius: "8px",
      backgroundColor: "#eff6ff"
    }}>
      <h3 style={{ color: "#1e40af", margin: 0, marginBottom: "0.5rem" }}>
        🔵 Server Component
      </h3>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>メッセージ:</strong> {data.message}
      </p>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>取得時刻:</strong> {data.fetchedAt}
      </p>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>ランダム値:</strong> {data.randomNumber}
      </p>
      <p style={{
        fontSize: "0.875rem",
        color: "#64748b",
        marginTop: "1rem",
        padding: "0.5rem",
        backgroundColor: "white",
        borderRadius: "4px"
      }}>
        💡 このコンポーネントはサーバーで実行され、<br/>
        画面遷移時にFlight Payload形式でクライアントに送信されます。
      </p>
    </div>
  );
}
