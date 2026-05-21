import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header requireAuth={false} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        <h1 className="font-serif text-4xl font-normal tracking-[-0.02em] leading-[1.05] mb-8">
          プライバシーポリシー
        </h1>
        <div className="space-y-8 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            memetec.（以下「当サービス」といいます）は、ユーザーの個人情報の保護を重要事項と考え、以下のとおりプライバシーポリシーを定めます。
          </p>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第1条（取得する個人情報）</h2>
            <p className="text-muted-foreground">
              当サービスは、本サービスの提供に必要な範囲で、アカウント登録に関する情報（メールアドレス等）および本サービスの利用に伴うアクセスログ等の情報を取得します。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第2条（利用目的）</h2>
            <p className="text-muted-foreground">
              取得した個人情報は、本サービスの提供・運営、お問い合わせへの対応、その他本サービスの運営上必要な目的のために利用します。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第3条（第三者提供）</h2>
            <p className="text-muted-foreground">
              当サービスは、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>法令に基づく場合</li>
              <li>人の生命・身体または財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第4条（安全管理措置）</h2>
            <p className="text-muted-foreground">
              当サービスは、個人情報の漏えい・滅失・毀損を防止するため、適切な安全管理措置を講じます。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第5条（Cookie・アクセスログ）
            </h2>
            <p className="text-muted-foreground">
              本サービスはログイン状態の維持にCookieを使用しています。アクセスログはサービスの保守管理・改善のみに利用し、個人を特定する目的では使用しません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第6条（個人情報に関するご要望）
            </h2>
            <p className="text-muted-foreground">
              アカウントに紐づくデータは、アカウント設定ページからご自身で削除できます。その他、当サービスが保有する個人情報に関するご要望については、下記お問い合わせ先までご連絡ください。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第7条（お問い合わせ）</h2>
            <p className="text-muted-foreground">
              個人情報の取り扱いに関するお問い合わせは、以下の窓口までご連絡ください。
            </p>
            <p className="text-muted-foreground">
              メールアドレス：contact@memetec.dev
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第8条（プライバシーポリシーの変更）
            </h2>
            <p className="text-muted-foreground">
              当サービスは、必要に応じてプライバシーポリシーを変更することがあります。変更後のポリシーは本ページに掲示した時点から効力を生じるものとします。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
