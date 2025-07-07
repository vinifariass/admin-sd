import BoletoForm from "@/components/admin/boleto-form";
import { getBoletoById } from "@/lib/actions/boleto.action";
import { marcarPagoBoleto } from "@/lib/actions/boleto.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
    title: 'Boleto',
};

const AdminBoletoDetailPage = async (props: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await props.params;
    const boleto = await getBoletoById(id);
    
    if (!boleto) return notFound();
    
    const isVencido = new Date(boleto.dataVencimento) < new Date() && !boleto.pago;
    const isVencendoHoje = new Date(boleto.dataVencimento).toDateString() === new Date().toDateString();
    
    const handleMarcarPago = async (pago: boolean) => {
        'use server';
        await marcarPagoBoleto({
            id: boleto.id,
            pago,
            dataPagamento: pago ? new Date() : undefined,
        });
    };
    
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Detalhes do Boleto</h1>
                <div className="flex gap-2">
                    {!boleto.pago && (
                        <form action={handleMarcarPago.bind(null, true)}>
                            <Button type="submit" className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Marcar como Pago
                            </Button>
                        </form>
                    )}
                    {boleto.pago && (
                        <form action={handleMarcarPago.bind(null, false)}>
                            <Button type="submit" variant="outline" className="flex items-center gap-2">
                                <XCircle className="h-4 w-4" />
                                Marcar como Não Pago
                            </Button>
                        </form>
                    )}
                </div>
            </div>
            
            {/* Informações do Boleto */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Informações do Boleto
                        <Badge variant={boleto.pago ? "default" : "secondary"}>
                            {boleto.pago ? 'Pago' : 'Não Pago'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Número do Boleto</label>
                            <p className="text-lg font-mono">{boleto.numeroBoleto}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Código de Barras</label>
                            <p className="text-sm font-mono break-all">{boleto.codigoBarras}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Apartamento</label>
                            <p className="text-lg">{boleto.apartamento}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Morador</label>
                            <p className="text-lg">{boleto.morador?.nome || 'Não informado'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Valor</label>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(boleto.valor)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                            <div className="flex items-center gap-2">
                                <p className="text-lg">{new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}</p>
                                {isVencendoHoje && (
                                    <Badge variant="secondary" className="text-orange-600">
                                        Vence hoje
                                    </Badge>
                                )}
                                {isVencido && (
                                    <Badge variant="destructive">
                                        Vencido
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {boleto.dataPagamento && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Data de Pagamento</label>
                                <p className="text-lg">{new Date(boleto.dataPagamento).toLocaleDateString('pt-BR')}</p>
                            </div>
                        )}
                        {boleto.observacoes && (
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                                <p className="text-lg">{boleto.observacoes}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Formulário de Edição */}
            <BoletoForm type="Atualizar" boleto={boleto} boletoId={boleto.id} />
        </div>
    );
};

export default AdminBoletoDetailPage;
