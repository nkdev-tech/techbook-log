import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header requireAuth={false} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">利用規約</h1>
        </div>
        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-medium text-base">第1条（総則）</h2>
            <p className="text-muted-foreground">
              本利用規約（以下「本規約」といいます）は、memetec.（以下「当サービス」といいます）が提供する技術書読書記録サービスの利用条件を定めるものです。ユーザーの皆さまは、本規約に同意のうえ、本サービスをご利用ください。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第2条（利用登録）</h2>
            <p className="text-muted-foreground">
              本サービスへの登録は、本サービス上に定める方法により行うことができます。以下に該当する場合は、利用登録をお断りすることがあります。
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>登録情報に虚偽の内容が含まれる場合</li>
              <li>過去に本規約違反により利用停止または登録削除された場合</li>
              <li>その他、当サービスが不適切と判断した場合</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第3条（禁止事項）</h2>
            <p className="text-muted-foreground">
              ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>他者を誹謗・中傷する行為</li>
              <li>著作権その他の知的財産権を侵害する行為</li>
              <li>当サービスのシステムへの不正アクセス</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第4条（投稿コンテンツ）</h2>
            <p className="text-muted-foreground">
              ユーザーが投稿した読書記録・メモ等のコンテンツ（以下「投稿コンテンツ」といいます）の著作権は、投稿したユーザーに帰属します。ユーザーは当サービスに対し、サービス運営に必要な範囲での利用を無償・非独占的に許諾するものとします。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第5条（サービスの変更・停止・終了）
            </h2>
            <p className="text-muted-foreground">
              当サービスは、事前の通知なく本サービスの内容を変更し、または提供を停止・終了することがあります。これによりユーザーに損害が生じた場合でも、当サービスは責任を負いません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第6条（免責事項）</h2>
            <p className="text-muted-foreground">
              当サービスは、本サービスの内容の正確性・完全性・有用性について、いかなる保証も行いません。本サービスの利用により損害が生じた場合、当サービスの故意または重過失による場合を除き、責任を負いません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第7条（個人情報の取り扱い）
            </h2>
            <p className="text-muted-foreground">
              当サービスは、ユーザーの個人情報を別途定めるプライバシーポリシーに従い適切に取り扱います。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">第8条（規約の変更）</h2>
            <p className="text-muted-foreground">
              当サービスは、必要と判断した場合に本規約を変更することがあります。変更後の規約は、本サービス上に掲示した時点から効力を生じるものとします。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-base">
              第9条（準拠法・管轄裁判所）
            </h2>
            <p className="text-muted-foreground">
              本規約の解釈にあたっては、日本国法を準拠法とします。本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <p className="text-muted-foreground">制定日：2026年6月1日</p>
        </div>
      </main>
    </div>
  );
}
