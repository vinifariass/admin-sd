import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Clock, CreditCard, Eye, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getBoletosByApartamento, getBoletoByCodigoBarras, marcarPagoBoleto } from "@/lib/actions/boleto.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Meus Boletos',
    description: 'Consulte e gerencie seus boletos do condomínio',
};

type SearchParams = {
    apartamento?: string;
    codigoBarras?: string;
};

const BoletoConsultaPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const session = await auth();
    
    if (!session) {
        redirect('/sign-in');
    }

    const resolvedSearchParams = await searchParams;
    const { apartamento, codigoBarras } = resolvedSearchParams;
    
    let boletos: any[] = [];
    let boletoEspecifico: any = null;

    // Se tem código de barras, busca boleto específico
    if (codigoBarras) {
        boletoEspecifico = await getBoletoByCodigoBarras(codigoBarras);
    }
    
    // Se tem apartamento, busca boletos do apartamento
    if (apartamento) {
        boletos = await getBoletosByApartamento(apartamento);
    }

    const handleMarcarPago = async (formData: FormData) => {
        'use server';
        
        const boletoId = formData.get('boletoId') as string;
        const isPago = formData.get('pago') === 'true';
        
        await marcarPagoBoleto({
            id: boletoId,
            pago: isPago,
            dataPagamento: isPago ? new Date() : undefined,
        });
    };

    const isVencido = (dataVencimento: Date, pago: boolean) => {
        return new Date(dataVencimento) < new Date() && !pago;
    };

    const isVencendoHoje = (dataVencimento: Date) => {
        const hoje = new Date();
        const vencimento = new Date(dataVencimento);
        return vencimento.toDateString() === hoje.toDateString();
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Consultar Boletos</h1>
                <p className="text-muted-foreground">Consulte seus boletos do condomínio pelo apartamento ou código de barras</p>
            </div>

            {/* Formulários de Busca */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Busca por Apartamento */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 dark:from-cyan-600 dark:via-cyan-700 dark:to-blue-700 shadow-xl">
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Search className="h-6 w-6 text-white" />
                            </div>
                            Buscar por Apartamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <form action="" method="GET" className="space-y-4">
                            <div>
                                <Label htmlFor="apartamento" className="text-cyan-100">Número do Apartamento</Label>
                                <Input
                                    id="apartamento"
                                    name="apartamento"
                                    placeholder="Ex: 101, 202, 303"
                                    defaultValue={apartamento || ''}
                                    className="bg-white/20 border-white/30 placeholder:text-white/70 text-white backdrop-blur-sm"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                                Buscar Boletos
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Busca por Código de Barras */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-xl">
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                    <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CreditCard className="h-6 w-6 text-white" />
                            </div>
                            Buscar por Código de Barras
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <form action="" method="GET" className="space-y-4">
                            <div>
                                <Label htmlFor="codigoBarras" className="text-emerald-100">Código de Barras</Label>
                                <Input
                                    id="codigoBarras"
                                    name="codigoBarras"
                                    placeholder="Cole o código de barras aqui"
                                    defaultValue={codigoBarras || ''}
                                    className="bg-white/20 border-white/30 placeholder:text-white/70 text-white backdrop-blur-sm"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                                Buscar Boleto
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Resultado da Busca por Código de Barras */}
            {boletoEspecifico && (
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-600 dark:via-orange-700 dark:to-red-700 shadow-xl">
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>
                    <CardHeader className="relative">
                        <CardTitle className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                Boleto Encontrado
                            </div>
                            <Badge 
                                variant={boletoEspecifico.pago ? "default" : "secondary"}
                                className={boletoEspecifico.pago 
                                    ? "bg-green-500 hover:bg-green-600 text-white" 
                                    : "bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                                }
                            >
                                {boletoEspecifico.pago ? 'Pago' : 'Não Pago'}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Label className="text-sm font-medium text-orange-100">Número do Boleto</Label>
                                <p className="text-lg font-mono text-white">{boletoEspecifico.numeroBoleto}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Label className="text-sm font-medium text-orange-100">Apartamento</Label>
                                <p className="text-lg text-white">{boletoEspecifico.apartamento}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Label className="text-sm font-medium text-orange-100">Valor</Label>
                                <p className="text-2xl font-bold text-white">{formatCurrency(boletoEspecifico.valor)}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Label className="text-sm font-medium text-orange-100">Data de Vencimento</Label>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-white">{new Date(boletoEspecifico.dataVencimento).toLocaleDateString('pt-BR')}</p>
                                    {isVencendoHoje(boletoEspecifico.dataVencimento) && (
                                        <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Vence hoje
                                        </Badge>
                                    )}
                                    {isVencido(boletoEspecifico.dataVencimento, boletoEspecifico.pago) && (
                                        <Badge variant="destructive">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Vencido
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {boletoEspecifico.dataPagamento && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Data de Pagamento</Label>
                                    <p className="text-lg">{new Date(boletoEspecifico.dataPagamento).toLocaleDateString('pt-BR')}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Botão para marcar como pago */}
                        <div className="mt-6 flex gap-2">
                            <form action={handleMarcarPago}>
                                <input type="hidden" name="boletoId" value={boletoEspecifico.id} />
                                <input type="hidden" name="pago" value={!boletoEspecifico.pago ? 'true' : 'false'} />
                                <Button type="submit" variant={boletoEspecifico.pago ? "outline" : "default"}>
                                    {boletoEspecifico.pago ? (
                                        <>
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Marcar como Não Pago
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Marcar como Pago
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resultado da Busca por Apartamento */}
            {apartamento && (
                <Card>
                    <CardHeader>
                        <CardTitle>Boletos do Apartamento {apartamento}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {boletos.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Vencimento</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {boletos.map((boleto: any) => (
                                        <TableRow key={boleto.id}>
                                            <TableCell className="font-mono">{boleto.numeroBoleto}</TableCell>
                                            <TableCell className="font-bold text-green-600">
                                                {formatCurrency(boleto.valor)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
                                                    {isVencendoHoje(boleto.dataVencimento) && (
                                                        <Badge variant="secondary" className="text-orange-600">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Hoje
                                                        </Badge>
                                                    )}
                                                    {isVencido(boleto.dataVencimento, boleto.pago) && (
                                                        <Badge variant="destructive">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Vencido
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={boleto.pago ? "default" : "secondary"}>
                                                    {boleto.pago ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Pago
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Não Pago
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <form action={handleMarcarPago} className="inline">
                                                    <input type="hidden" name="boletoId" value={boleto.id} />
                                                    <input type="hidden" name="pago" value={!boleto.pago ? 'true' : 'false'} />
                                                    <Button type="submit" size="sm" variant={boleto.pago ? "outline" : "default"}>
                                                        {boleto.pago ? 'Desfazer' : 'Pagar'}
                                                    </Button>
                                                </form>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="mx-auto h-12 w-12 mb-4" />
                                <p>Nenhum boleto encontrado para o apartamento {apartamento}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Instruções */}
            {!apartamento && !codigoBarras && (
                <Card>
                    <CardHeader>
                        <CardTitle>Como usar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold">Buscar por Apartamento:</h4>
                                <p className="text-muted-foreground">
                                    Digite o número do seu apartamento para ver todos os boletos relacionados.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Buscar por Código de Barras:</h4>
                                <p className="text-muted-foreground">
                                    Cole o código de barras do boleto para consultar informações específicas.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Marcar como Pago:</h4>
                                <p className="text-muted-foreground">
                                    Após realizar o pagamento, marque o boleto como pago para manter o controle.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BoletoConsultaPage;
