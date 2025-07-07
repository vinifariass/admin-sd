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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Buscar por Apartamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" method="GET" className="space-y-4">
                            <div>
                                <Label htmlFor="apartamento">Número do Apartamento</Label>
                                <Input
                                    id="apartamento"
                                    name="apartamento"
                                    placeholder="Ex: 101, 202, 303"
                                    defaultValue={apartamento || ''}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Buscar Boletos
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Busca por Código de Barras */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Buscar por Código de Barras
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" method="GET" className="space-y-4">
                            <div>
                                <Label htmlFor="codigoBarras">Código de Barras</Label>
                                <Input
                                    id="codigoBarras"
                                    name="codigoBarras"
                                    placeholder="Cole o código de barras aqui"
                                    defaultValue={codigoBarras || ''}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Buscar Boleto
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Resultado da Busca por Código de Barras */}
            {boletoEspecifico && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Boleto Encontrado
                            <Badge variant={boletoEspecifico.pago ? "default" : "secondary"}>
                                {boletoEspecifico.pago ? 'Pago' : 'Não Pago'}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Número do Boleto</Label>
                                <p className="text-lg font-mono">{boletoEspecifico.numeroBoleto}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Apartamento</Label>
                                <p className="text-lg">{boletoEspecifico.apartamento}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(boletoEspecifico.valor)}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Data de Vencimento</Label>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg">{new Date(boletoEspecifico.dataVencimento).toLocaleDateString('pt-BR')}</p>
                                    {isVencendoHoje(boletoEspecifico.dataVencimento) && (
                                        <Badge variant="secondary" className="text-orange-600">
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
