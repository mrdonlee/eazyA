import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Download, Play, Upload } from 'lucide-react'

export default function ModelsPage() {
    return (
        <div className="py-6 space-y-6 mx-8">
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
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-filter"
                                >
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                <span className="sr-only">Filter</span>
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Input type="search" placeholder="Search datasets..." />
                                <Button type="submit">Search</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Card key={i}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle>Model {i}</CardTitle>
                                        <Badge variant={i % 2 === 0 ? 'default' : 'secondary'}>
                                            {i % 2 === 0 ? 'GPU' : 'CPU'}
                                        </Badge>
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
