'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const BoletoFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'todos');
    const [apartamento, setApartamento] = useState(searchParams.get('apartamento') || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (status && status !== 'todos') params.set('status', status);
        if (apartamento) params.set('apartamento', apartamento);
        params.set('page', '1');
        
        router.push(`/admin/boletos?${params.toString()}`);
    };

    const handleClear = () => {
        setQuery('');
        setStatus('todos');
        setApartamento('');
        router.push('/admin/boletos');
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar por número do boleto, código de barras ou morador..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="nao-pago">Não Pago</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Apartamento"
                            value={apartamento}
                            onChange={(e) => setApartamento(e.target.value)}
                            className="w-full md:w-32"
                        />
                        
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Buscar
                            </Button>
                            <Button variant="outline" onClick={handleClear}>
                                Limpar
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BoletoFilter;
