import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, Info, Play, Database } from "lucide-react"
import { SetStateAction, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Dataset {
    id: number;
    title: string;
    description: string;
    size: string;
    format: string;
    lastUpdated: string;
    usageCost: string;
    columns: string[];
    rowCount: number;
}

export default function DatasetsPage() {
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCardClick = (dataset: Dataset) => {
        setSelectedDataset(dataset);
        setIsDialogOpen(true);
    };

    const mockDatasets = [
        {
            id: 1,
            title: "Dataset 1",
            description: "Image classification dataset with 10,000 samples",
            size: "2.3 GB",
            format: "CSV",
            lastUpdated: "2 days ago",
            usageCost: "$0.05/query",
            columns: ["id", "image_url", "label", "confidence_score"],
            rowCount: 10000,
        },
        {
            id: 2,
            title: "Dataset 2",
            description: "NLP sentiment analysis dataset",
            size: "1.8 GB",
            format: "CSV",
            lastUpdated: "5 days ago",
            usageCost: "$0.04/query",
            columns: ["id", "text", "sentiment", "confidence"],
            rowCount: 8500,
        },
        // Add the rest of your datasets here
    ];

    // Create datasets for all 6 items
    const allDatasets = Array(6).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Dataset ${i + 1}`,
        description: i % 2 === 0 ?
            "Image classification dataset with 10,000 samples" :
            "NLP sentiment analysis dataset",
        size: i % 2 === 0 ? "2.3 GB" : "1.8 GB",
        format: "CSV",
        lastUpdated: i % 3 === 0 ? "2 days ago" : i % 3 === 1 ? "5 days ago" : "1 week ago",
        usageCost: `$0.0${i + 1}/query`,
        columns: i % 2 === 0 ?
            ["id", "image_url", "label", "confidence_score"] :
            ["id", "text", "sentiment", "confidence"],
        rowCount: i % 2 === 0 ? 10000 : 8500,
    }));

    return (
        <div className="container py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
                <Button onClick={async () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                            const response = await fetch('http://localhost:3000/api/upload', {
                                method: 'POST',
                                body: formData,
                            });

                            if (response.ok) {
                                const data = await response.json();
                                alert('Dataset uploaded successfully!');
                                // You might want to refresh the list or add the new dataset
                            } else {
                                alert('Failed to upload dataset');
                            }
                        } catch (error) {
                            console.error('Error uploading file:', error);
                            alert('Error uploading file');
                        }
                    };
                    input.click();
                }}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Dataset
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Datasets</TabsTrigger>
                    <TabsTrigger value="my">My Datasets</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                                <span className="sr-only">Filter</span>
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Input type="search" placeholder="Search datasets..." />
                                <Button type="submit">Search</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allDatasets.map((dataset) => (
                            <Card
                                key={dataset.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleCardClick(dataset)}
                            >
                                <CardHeader>
                                    <CardTitle>{dataset.title}</CardTitle>
                                    <CardDescription>{dataset.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Size:</span>
                                            <span className="text-sm">{dataset.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Format:</span>
                                            <span className="text-sm">{dataset.format}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Last Updated:</span>
                                            <span className="text-sm">{dataset.lastUpdated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Usage Cost:</span>
                                            <span className="text-sm">{dataset.usageCost}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="my">
                    <p className="text-muted-foreground">Your uploaded datasets will appear here.</p>
                </TabsContent>
            </Tabs>

            {/* Dataset Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedDataset && (
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedDataset.title}</DialogTitle>
                            <DialogDescription>{selectedDataset.description}</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-3">
                                <div className="font-medium text-sm">Dataset Information</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Size:</div>
                                    <div>{selectedDataset.size}</div>
                                    <div className="text-muted-foreground">Format:</div>
                                    <div>{selectedDataset.format}</div>
                                    <div className="text-muted-foreground">Last Updated:</div>
                                    <div>{selectedDataset.lastUpdated}</div>
                                    <div className="text-muted-foreground">Usage Cost:</div>
                                    <div>{selectedDataset.usageCost}</div>
                                    <div className="text-muted-foreground">Rows:</div>
                                    <div>{selectedDataset.rowCount.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="font-medium text-sm">Schema</div>
                                <div className="border rounded-md p-3 bg-muted/50">
                                    <div className="text-sm font-mono">
                                        {selectedDataset.columns.map((col, i) => (
                                            <div key={i} className="py-1">
                                                {col}{i < selectedDataset.columns.length - 1 && ','}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 my-2">
                            <div className="font-medium">What would you like to do with this dataset?</div>
                        </div>

                        <DialogFooter>
                            <div className="grid grid-cols-4 gap-2 w-full">
                                <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => {
                                    setIsDialogOpen(false);
                                    // Navigate to analysis page or show another dialog
                                    alert("Navigate to analysis page");
                                }}>
                                    <Play className="mr-2 h-4 w-4" /> Analyze
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => {
                                    setIsDialogOpen(false);
                                    // Navigate to data preview page
                                    alert("Navigate to data preview page");
                                }}>
                                    <Database className="mr-2 h-4 w-4" /> Preview
                                </Button>
                                <Button variant="secondary" className="w-full" onClick={() => {
                                    setIsDialogOpen(false);
                                    // Show detailed documentation
                                    alert("Show documentation");
                                }}>
                                    <Info className="mr-2 h-4 w-4" /> Docs
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
