
---

## ベストプラクティス

### 1. 適切なSkillの選択

タスクタイプに基づいてSkillを選択：

| タスクタイプ | 推奨組み合わせ |
|---|---|
| 高速Gitコミット | `delegate_task(category='quick', load_skills=['git-master'])` |
| UIインターフェースデザイン | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| ブラウザ検証 | `delegate_task(category='quick', load_skills=['playwright'])` |
| 複雑なブラウザワークフロー | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. 複数Skillsの組み合わせ

複数のSkillsを同時に読み込むことができます：

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="ログイン機能をテストし、完了後にコードをコミット"
)
```

### 3. よくある間違いの回避

::: warning 警告

- ❌ **間違い**：`git-master` 使用時に手動でコミットメッセージを指定
  - ✅ **正しい**：`git-master` にプロジェクトスタイルに合ったコミットメッセージの自動検出と生成を任せる

- ❌ **間違い**：`frontend-ui-ux` 使用時に「普通でいい」と要求
  - ✅ **正しい**：エージェントにデザイナー能力を最大限発揮させ、独自のデザインを創造させる

- ❌ **間違い**：`dev-browser` スクリプトでTypeScript型アノテーションを使用
  - ✅ **正しい**：`page.evaluate()` 内では純粋なJavaScriptを使用（ブラウザはTS構文を認識しない）
:::

---

## 本レッスンのまとめ

本レッスンでは4つの組み込みSkillsを紹介しました：

| Skill | 中核的価値 | 典型的シナリオ |
|---|---|---|
| **playwright** | 完全なブラウザ自動化 | UIテスト、スクリーンショット、クローリング |
| **frontend-ui-ux** | デザイナー視点、美観優先 | UIコンポーネントデザイン、インターフェース美化 |
| **git-master** | Git操作の自動化、原子コミット | コードコミット、履歴検索 |
| **dev-browser** | 永続化セッション、複雑なワークフロー | 複数回のブラウザ操作 |

**中核ポイント**：
1. **Skill = 専門知識 + ツール**：エージェントに特定領域のベストプラクティスを注入
2. **組み合わせ使用**：`delegate_task(category=..., load_skills=[...])` で精密マッチングを実現
3. **コスト最適化**：単純なタスクには `quick` categoryを使用し、高価なモデルを避ける
4. **アンチパターンワーニング**：各Skillには明確な「何をしないか」の指針がある

---

## 次回レッスン予告

> 次回は **[ライフサイクルフック](../lifecycle-hooks/)** を学びます。
>
> 学ぶ内容：
> - 32個のライフサイクルフックの役割と実行順序
> - コンテキスト注入とエラー回復の自動化方法
> - よく使用するフックの設定方法（todo-continuation-enforcer、keyword-detector など）

---

## 付録：ソースコード参照

<details>
<summary><strong>ソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
|---|---|---|
| playwright Skill定義 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| createBuiltinSkills関数 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| BuiltinSkill型定義 | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| 組み込みSkills読み込みロジック | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| ブラウザエンジン設定 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**重要な設定**：
- `browser_automation_engine.provider`: ブラウザ自動化エンジン（デフォルト `playwright`、オプション `agent-browser`）
- `disabled_skills`: 無効にするSkillリスト

**重要な関数**：
- `createBuiltinSkills(options)`: ブラウザエンジン設定に基づき対応するSkills配列を返す

</details>
