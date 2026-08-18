import { getCondominios, criarCondominio, atualizarCondominio } from '@/lib/actions/condominio.action';

export default async function CondominiosPage() {
  const condominios = await getCondominios();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Condomínios</h1>
        <p className="text-muted-foreground">Cadastre até 10 condomínios e o Chat ID de cada grupo ou conversa do Telegram.</p>
      </div>

      <form action={criarCondominio} className="space-y-3 rounded-lg border p-4">
        <input name="nome" required placeholder="Nome do condomínio" className="w-full rounded-md border px-3 py-2" />
        <input name="telegramChatId" required placeholder="Chat ID do Telegram (ex.: -100123...)" className="w-full rounded-md border px-3 py-2" />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Cadastrar condomínio</button>
      </form>

      <div className="rounded-lg border divide-y">
        {condominios.map((condominio) => (
          <form key={condominio.id} action={atualizarCondominio} className="grid gap-2 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            <input type="hidden" name="id" value={condominio.id} />
            <input name="nome" required defaultValue={condominio.nome} className="rounded-md border px-3 py-2" />
            <input name="telegramChatId" required defaultValue={condominio.telegramChatId} className="rounded-md border px-3 py-2" />
            <button type="submit" className="rounded-md border px-4 py-2">Salvar</button>
          </form>
        ))}
      </div>
    </div>
  );
}
