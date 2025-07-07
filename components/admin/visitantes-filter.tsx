'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface VisitantesFilterProps {
    currentStatus: string;
}

export default function VisitantesFilter({ currentStatus }: VisitantesFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleStatusChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (value && value !== 'TODOS') {
            params.set('status', value);
        } else {
            params.delete('status');
        }
        
        // Reset to first page when filtering
        params.delete('page');
        
        router.push(`/admin/visitantes?${params.toString()}`);
    };

    return (
        <Select value={currentStatus || 'TODOS'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="AGENDADO">Agendado</SelectItem>
                <SelectItem value="AUTORIZADO">Autorizado</SelectItem>
                <SelectItem value="CHEGOU">Chegou</SelectItem>
                <SelectItem value="SAIU">Saiu</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
        </Select>
    );
}
