# assets/social — SNS公開素材の永続配信ディレクトリ

FUKASELL AI Affiliate Division の Publishing Operations が、QA PASS 済みの SNS 画像を
Metricool `createScheduledPost` へ **人手のコピペなし** で渡すための公開配信経路。
既存の GitHub Pages（このリポジトリ、`main` ブランチ、ルート配信）を使う。追加基盤・追加課金なし。

## 公開URL形式

```
https://fukasell.github.io/yoridori-media/assets/social/<persona_id>/<content_id>/<asset_id>.png
```

例（北欧と明かり IG-01 スライド1）:

```
https://fukasell.github.io/yoridori-media/assets/social/in-women-nordic-natural/nordic-wave2-IG-01-r2/nordic-ig01-v1-s01.png
```

- `main` にマージされた時点で GitHub Pages が自動ビルドし、通常 1〜2 分以内に HTTP 200 で配信される。
- ブランチ上のファイルは Pages では配信されない。マージ前の疎通確認にだけ
  `https://raw.githubusercontent.com/fukasell/yoridori-media/<branch>/assets/social/...` を使う（本番予約には使わない）。
- Metricool は予約作成時に URL を取得して `static.metricool.com` へ再ホストするため、
  予約作成時点で URL が 200 / `image/png` を返すことが必須条件。マージ後に削除しない。

## 置いてよいもの / 置いてはいけないもの

置いてよいもの:
- 守 / MAMORU（QA & Compliance）が `PASS` を出した SNS 投稿用画像（PNG / JPG / WebP）
- 各 `content_id` フォルダに `manifest.json`（asset_id, filename, sha256, width, height, qa_id）

置いてはいけないもの（このリポジトリは公開）:
- 秘密情報・認証情報・API キー・個人ファイル・debug screenshot
- QA 未通過素材、他者の画像・ロゴ、権利未確認素材
- Control Center の task artifact や社内レポート

## Publishing Operations の手順（ChatGPT / GitHub connector）

1. QA PASS コメントの sha256 と ChatGPT Library の実ファイルを照合する。
2. GitHub connector で `main` に対して `assets/social/<persona_id>/<content_id>/<asset_id>.png` を追加する
   （Contents API `PUT /repos/fukasell/yoridori-media/contents/<path>` に base64 本文）。同じフォルダに `manifest.json` を置く。
3. 1〜2 分後に各 URL を `GET` し、`HTTP 200` と `content-type: image/png` を確認する。
   sha256 を再計算し、QA PASS の値と一致することを確認する。
4. 一致した URL だけを Metricool `createScheduledPost` の `media` に順序どおり渡す。
   `instagramData.isAiGenerated=true` など QA 条件はそのまま維持する。
5. `getScheduledPosts` で再取得し、media が付いた予約が 1 件だけ存在することを確認する。

## テスト素材

`test/fukasell-media-transport-test-20260910.png` は経路検証専用の 1080x1080 無地 PNG（文字・ブランド・個人情報なし）。
sha256: `15bb68305b30cd0635666867dc25f1c29308451dea74f199de2c856ea40b4a31`
