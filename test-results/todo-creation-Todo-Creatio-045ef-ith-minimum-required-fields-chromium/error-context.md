# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "ページナビゲーション" [ref=e4]:
    - list [ref=e5]:
      - listitem [ref=e6]:
        - link "ホーム" [ref=e7] [cursor=pointer]:
          - /url: /
        - img [ref=e9]
      - listitem [ref=e11]:
        - link "Todo管理" [ref=e12] [cursor=pointer]:
          - /url: /todos
        - img [ref=e14]
      - listitem [ref=e16]: 詳細
  - generic [ref=e18]:
    - generic [ref=e19]: Todoが見つかりません
    - button "一覧に戻る" [ref=e20] [cursor=pointer]:
      - img [ref=e22]
      - text: 一覧に戻る
  - generic [ref=e24]:
    - img [ref=e26]
    - button "Open Tanstack query devtools" [ref=e74] [cursor=pointer]:
      - img [ref=e75]
  - generic [ref=e127] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e128]:
      - img [ref=e129]
    - generic [ref=e132]:
      - button "Open issues overlay" [ref=e133]:
        - generic [ref=e134]:
          - generic [ref=e135]: "0"
          - generic [ref=e136]: "1"
        - generic [ref=e137]: Issue
      - button "Collapse issues badge" [ref=e138]:
        - img [ref=e139]
  - alert [ref=e141]
```