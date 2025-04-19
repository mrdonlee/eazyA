import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Play, Upload } from "lucide-react"

export default function ModelsPage() {
    return (
        <div className="container py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Models</h1>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Model
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Models</TabsTrigger>
                    <TabsTrigger value="my">My Models</TabsTrigger>
                    <TabsTrigger value="public">Public Models</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="search" placeholder="Search models..." />
                        <Button type="submit">Search</Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle>Model {i}</CardTitle>
                                        <Badge variant={i % 2 === 0 ? "default" : "secondary"}>{i % 2 === 0 ? "GPU" : "CPU"}</Badge>
                                    </div>
                                    <CardDescription>Image classification model with 95% accuracy</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Size:</span>
                                            <span className="text-sm">1.2 GB</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Framework:</span>
                                            <span className="text-sm">PyTorch</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Last Updated:</span>
                                            <span className="text-sm">5 days ago</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Usage Cost:</span>
                                            <span className="text-sm">$0.10/hour</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button variant="outline" className="flex-1">
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                    <Button className="flex-1">
                                        <Play className="mr-2 h-4 w-4" /> Run
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="my">
                    <p className="text-muted-foreground">Your uploaded models will appear here.</p>
                </TabsContent>
                <TabsContent value="public">
                    <p className="text-muted-foreground">Public models will appear here.</p>
                </TabsContent>
            </Tabs>
        </div>
    )
}
