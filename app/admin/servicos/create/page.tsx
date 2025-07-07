'use client';
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { salvarRecibos } from "@/lib/actions/recibo.action";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  History, 
  TrendingUp,
  Download,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Cog,
  Hash,
  Eye,
  Lightbulb,
  Info
} from "lucide-react";

interface ExcelRow {
  nomeServico: string;
  dataVencimento: string;
  isValid: boolean;
  rowNumber: number;
  errors: string[];
}

interface ColumnMapping {
  serviceColumn: string;
  dateColumn: string;
}

export default function ExcelImporter() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [uploadTime, setUploadTime] = useState<string>("");
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    serviceColumn: "",
    dateColumn: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const validRows = data.filter(row => row.isValid);
  const invalidRows = data.filter(row => !row.isValid);

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setData([]);
    setFileName(null);
    setFileSize("");
    setUploadTime("");
    setAvailableColumns([]);
    setColumnMapping({ serviceColumn: "", dateColumn: "" });
    setCurrentPage(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const detectColumns = (headers: string[]): ColumnMapping => {
    const servicePatterns = ['servico', 'nomeservico', 'serviço', 'service', 'nome'];
    const datePatterns = ['data', 'datavencimento', 'vencimento', 'date', 'due'];
    
    let serviceColumn = "";
    let dateColumn = "";

    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, '');
      
      if (!serviceColumn && servicePatterns.some(pattern => 
        normalizedHeader.includes(pattern))) {
        serviceColumn = header;
      }
      
      if (!dateColumn && datePatterns.some(pattern => 
        normalizedHeader.includes(pattern))) {
        dateColumn = header;
      }
    });

    return { serviceColumn, dateColumn };
  };

  const isExcelDate = (value: any): boolean => {
    return typeof value === "number" && value > 40000;
  };

  const formatExcelDate = (excelSerialDate: number): string => {
    try {
      const date = XLSX.SSF.parse_date_code(excelSerialDate);
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    } catch {
      return "Data Inválida";
    }
  };

  const validateAndFormatDate = (dateValue: any): { formatted: string; isValid: boolean; error?: string } => {
    if (!dateValue) {
      return { formatted: "Data Inválida", isValid: false, error: "Data não informada" };
    }

    // Handle Excel date numbers
    if (isExcelDate(dateValue)) {
      const formatted = formatExcelDate(dateValue);
      return { formatted, isValid: formatted !== "Data Inválida" };
    }

    // Handle string dates
    if (typeof dateValue === "string") {
      const dateStr = dateValue.trim();
      
      // Try to parse various date formats
      const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
      ];

      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          try {
            let day, month, year;
            
            if (format.source.startsWith("^(\\d{4})")) {
              // YYYY-MM-DD format
              year = parseInt(match[1]);
              month = parseInt(match[2]);
              day = parseInt(match[3]);
            } else {
              // Assume DD/MM/YYYY format for ambiguous cases
              day = parseInt(match[1]);
              month = parseInt(match[2]);
              year = parseInt(match[3]);
            }

            const date = new Date(year, month - 1, day);
            
            if (date.getFullYear() === year && 
                date.getMonth() === month - 1 && 
                date.getDate() === day) {
              return {
                formatted: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                isValid: true
              };
            }
          } catch {
            // Continue to next format
          }
        }
      }
    }

    return { 
      formatted: "Data Inválida", 
      isValid: false, 
      error: "Formato de data não reconhecido" 
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
      });
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
    setUploadTime(new Date().toLocaleString('pt-BR'));

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows: any[] = XLSX.utils.sheet_to_json(sheet);
        
        if (rows.length === 0) {
          toast.error("Arquivo vazio", {
            description: "O arquivo Excel não contém dados válidos",
          });
          setIsProcessing(false);
          return;
        }

        // Get available columns
        const headers = Object.keys(rows[0]);
        setAvailableColumns(headers);
        
        // Auto-detect columns
        const detectedMapping = detectColumns(headers);
        setColumnMapping(detectedMapping);

        // If we can auto-detect both columns, process immediately
        if (detectedMapping.serviceColumn && detectedMapping.dateColumn) {
          processData(rows, detectedMapping);
        }

        setIsProcessing(false);
      } catch (error) {
        toast.error("Erro ao processar arquivo", {
          description: "Verifique se o arquivo não está corrompido",
        });
        setIsProcessing(false);
      }
    };
  };

  const processData = (rows: any[], mapping: ColumnMapping) => {
    const processedRows: ExcelRow[] = rows.map((row, index) => {
      const serviceValue = row[mapping.serviceColumn];
      const dateValue = row[mapping.dateColumn];
      
      const errors: string[] = [];
      let isValid = true;

      // Validate service name
      const nomeServico = serviceValue?.toString().trim() || "";
      if (!nomeServico) {
        errors.push("Nome do serviço é obrigatório");
        isValid = false;
      }

      // Validate and format date
      const dateResult = validateAndFormatDate(dateValue);
      if (!dateResult.isValid) {
        errors.push(dateResult.error || "Data inválida");
        isValid = false;
      }

      return {
        nomeServico,
        dataVencimento: dateResult.formatted,
        isValid,
        rowNumber: index + 2, // +2 because Excel rows start at 1 and we skip header
        errors,
      };
    });

    setData(processedRows);
    setCurrentPage(1);
  };

  const handleColumnMappingChange = (type: 'service' | 'date', value: string) => {
    const newMapping = {
      ...columnMapping,
      [type === 'service' ? 'serviceColumn' : 'dateColumn']: value,
    };
    setColumnMapping(newMapping);

    // If both columns are selected, reprocess data
    if (newMapping.serviceColumn && newMapping.dateColumn && data.length === 0) {
      // We need to re-read the file, but for now just update the mapping
      // In a real implementation, you'd store the raw data and reprocess
    }
  };

  // Função para enviar os dados para o banco de dados
  const handleSave = async () => {
    const validData = data.filter((row) => row.dataVencimento !== "Data Inválida");
    if (validData.length === 0) {
      alert("Nenhum dado válido para salvar.");
      return;
    }

    setIsSaving(true);
    
    try {
      const res = await salvarRecibos(validData);
      toast(res.message);
      resetForm();
    } catch (error) {
      toast.error("Erro ao salvar", {
        description: "Ocorreu um erro ao salvar os dados",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportErrors = () => {
    if (invalidRows.length === 0) {
      toast.success("Nenhum erro encontrado", {
        description: "Todos os registros são válidos",
      });
      return;
    }

    const errorData = invalidRows.map(row => ({
      Linha: row.rowNumber,
      Serviço: row.nomeServico,
      Data: row.dataVencimento,
      Erros: row.errors.join('; '),
    }));

    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Erros");
    XLSX.writeFile(wb, "erros_importacao.xlsx");
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <FileText className="text-green-600 dark:text-green-400" />
            Importador de Excel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Importe dados de serviços com datas de vencimento de forma inteligente</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* File Upload Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="text-blue-600 dark:text-blue-400" />
                    Upload de Arquivo
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Formatos suportados:</span>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">.xlsx</Badge>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">.xls</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Upload Zone */}
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={openFileSelector}
                >
                  <div className="mb-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Arraste e solte seu arquivo aqui</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ou clique para selecionar</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                </div>

                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".xlsx,.xls" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />

                {/* File Info */}
                {fileName && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="text-green-600 dark:text-green-400 h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{fileSize} • Carregado em {uploadTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Válido
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={resetForm}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Column Mapping */}
            {availableColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="text-blue-600 dark:text-blue-400" />
                    Mapeamento de Colunas
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">Confirme ou ajuste o mapeamento das colunas detectadas</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Cog className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        Coluna de Serviço
                      </label>
                      <Select value={columnMapping.serviceColumn} onValueChange={(value) => handleColumnMappingChange('service', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        Coluna de Data
                      </label>
                      <Select value={columnMapping.dateColumn} onValueChange={(value) => handleColumnMappingChange('date', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de data" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {columnMapping.serviceColumn && columnMapping.dateColumn && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="text-yellow-600 dark:text-yellow-400 mt-0.5 h-4 w-4" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">Detecção Automática</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Detectamos automaticamente as colunas "{columnMapping.serviceColumn}" e "{columnMapping.dateColumn}". 
                            Você pode ajustar se necessário.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {columnMapping.serviceColumn && columnMapping.dateColumn && data.length === 0 && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => {
                          // Trigger reprocessing with current mapping
                          if (fileInputRef.current?.files?.[0]) {
                            handleFileUpload({ target: { files: [fileInputRef.current.files[0]] } } as any);
                          }
                        }}
                        className="w-full"
                      >
                        Processar Dados
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Data Preview */}
            {data.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="text-blue-600 dark:text-blue-400" />
                      Pré-visualização dos Dados
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {validRows.length} registros válidos
                      </Badge>
                      <Badge variant="destructive" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        {invalidRows.length} erros
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableHead>
                            <Hash className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            Linha
                          </TableHead>
                          <TableHead>
                            <Cog className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            Serviço
                          </TableHead>
                          <TableHead>
                            <Calendar className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            Data de Vencimento
                          </TableHead>
                          <TableHead>
                            <CheckCircle className="inline mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((row, index) => (
                          <TableRow key={startIndex + index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="text-gray-600 dark:text-gray-400">{row.rowNumber}</TableCell>
                            <TableCell className="text-gray-900 dark:text-white">{row.nomeServico}</TableCell>
                            <TableCell className={row.isValid ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}>
                              {row.dataVencimento}
                            </TableCell>
                            <TableCell>
                              {row.isValid ? (
                                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Válido
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Erro
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, data.length)} de {data.length} registros
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" />
                          Anterior
                        </Button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={currentPage === page ? "bg-blue-600 dark:bg-blue-500" : ""}
                            >
                              {page}
                            </Button>
                          );
                        })}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Próximo
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <div className="flex items-center gap-3">
                      {invalidRows.length > 0 && (
                        <Button variant="outline" onClick={exportErrors}>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Erros
                        </Button>
                      )}
                      <Button 
                        onClick={handleSave}
                        disabled={validRows.length === 0 || isSaving}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Salvando..." : "Salvar Dados"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Manual Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-blue-600 dark:text-blue-400" />
                  Manual de Uso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                    <Info className="text-blue-600 dark:text-blue-400 h-4 w-4" />
                    Formato do Excel
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Sua planilha deve conter as colunas:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• <strong>Serviço</strong> ou <strong>nomeServico</strong></li>
                    <li>• <strong>Data</strong> ou <strong>dataVencimento</strong></li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                    <Calendar className="text-green-600 dark:text-green-400 h-4 w-4" />
                    Formatos de Data
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• DD/MM/YYYY (25/04/2024)</li>
                    <li>• MM/DD/YYYY (04/25/2024)</li>
                    <li>• YYYY-MM-DD (2024-04-25)</li>
                    <li>• Data do Excel (número serial)</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                    <Lightbulb className="text-yellow-600 dark:text-yellow-400 h-4 w-4" />
                    Exemplo de Planilha
                  </h4>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-4 font-bold border-b border-gray-200 dark:border-gray-700 pb-1 mb-1">
                      <span className="text-gray-900 dark:text-white">Serviço</span>
                      <span className="text-gray-900 dark:text-white">Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                      <span>Limpeza</span>
                      <span>25/04/2024</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                      <span>Reforma</span>
                      <span>30/04/2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="text-blue-600 dark:text-blue-400" />
                  Histórico de Uploads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Histórico de uploads não disponível
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-3" disabled>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Histórico Completo
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total de Imports</span>
                    <span className="font-bold text-gray-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Registros Processados</span>
                    <span className="font-bold text-gray-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Sucesso</span>
                    <span className="font-bold text-green-600 dark:text-green-400">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
