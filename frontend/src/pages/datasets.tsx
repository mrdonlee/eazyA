import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, Info, Play, Database } from "lucide-react"
import { useState } from "react"
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


    // Create datasets for all 6 items
    const allDatasets = [
        {
            id: 1,
            title: "MNIST Digit Classification",
            description: "Handwritten digit recognition dataset with 70,000 labeled images",
            size: "11.8 MB",
            format: "CSV",
            lastUpdated: "2 days ago",
            usageCost: "$0.01/query",
            columns: ["id", "image_data", "label", "split"],
            rowCount: 70000,
        },
        {
            id: 2,
            title: "Twitter Sentiment Analysis",
            description: "Curated tweets labeled for sentiment analysis research",
            size: "2.3 GB",
            format: "JSON",
            lastUpdated: "5 days ago",
            usageCost: "$0.02/query",
            columns: ["id", "text", "sentiment", "timestamp", "user_id", "location"],
            rowCount: 1500000,
        },
        {
            id: 3,
            title: "COVID-19 Case Statistics",
            description: "Global COVID-19 case data by country and region",
            size: "458 MB",
            format: "CSV",
            lastUpdated: "1 week ago",
            usageCost: "Free",
            columns: ["date", "country", "region", "cases", "deaths", "recoveries", "tests"],
            rowCount: 125000,
        },
        {
            id: 4,
            title: "E-commerce User Behavior",
            description: "Customer interaction data from a major online retailer",
            size: "5.7 GB",
            format: "Parquet",
            lastUpdated: "3 days ago",
            usageCost: "$0.05/query",
            columns: ["user_id", "session_id", "page_visited", "time_spent", "add_to_cart", "purchase", "timestamp"],
            rowCount: 3200000,
        },
        {
            id: 5,
            title: "ImageNet Subset",
            description: "Curated subset of the ImageNet database with 50,000 labeled images across 100 categories",
            size: "12.4 GB",
            format: "TFRecord",
            lastUpdated: "2 weeks ago",
            usageCost: "$0.08/query",
            columns: ["image_id", "image_url", "label", "category", "bounding_box", "license"],
            rowCount: 50000,
        },
        {
            id: 6,
            title: "Financial Market Data",
            description: "Historical stock prices and trading volumes for S&P 500 companies",
            size: "1.2 GB",
            format: "CSV",
            lastUpdated: "1 day ago",
            usageCost: "$0.03/query",
            columns: ["date", "ticker", "open", "high", "low", "close", "volume", "adj_close"],
            rowCount: 2500000,
        }
    ];

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
                                        <Download className="mr-2 h-4 w-4" /> Request Access
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
                                    <Download className=" h-4 w-4" /> Request Access
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
