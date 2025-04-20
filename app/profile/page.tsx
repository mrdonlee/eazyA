import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Edit, Download, Upload } from 'lucide-react'

export default function ProfilePage() {
    return (
        <div className="py-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <Card className="md:w-1/3">
                    <CardHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@user" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 text-center">
                                <h2 className="text-2xl font-bold">John Doe</h2>
                                <p className="text-muted-foreground">john.doe@example.com</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium">Member Since</div>
                                <div className="text-sm text-muted-foreground">January 15, 2023</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Subscription</div>
                                <div className="text-sm text-muted-foreground">Pro Plan</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">API Key</div>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="text-sm text-muted-foreground text-center">••••••••••••••••</div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <span className="sr-only">Copy</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-3 w-3"
                                        >
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex-1 space-y-6">
                    <Tabs defaultValue="usage" className="w-full">
                        <TabsList>
                            <TabsTrigger value="usage">Usage</TabsTrigger>
                            <TabsTrigger value="uploads">Uploads</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                        </TabsList>
                        <TabsContent value="usage" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resource Usage</CardTitle>
                                    <CardDescription>Your current resource usage and limits</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Storage</span>
                                            <span className="text-sm text-muted-foreground">15.2 GB / 50 GB</span>
                                        </div>
                                        <Progress value={30} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Compute Hours</span>
                                            <span className="text-sm text-muted-foreground">45 / 100 hours</span>
                                        </div>
                                        <Progress value={45} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">API Calls</span>
                                            <span className="text-sm text-muted-foreground">12,345 / 50,000</span>
                                        </div>
                                        <Progress value={25} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage History</CardTitle>
                                    <CardDescription>Your resource usage over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                                        <p className="text-muted-foreground">Usage chart will appear here</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="uploads" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-left">Recent Uploads</CardTitle>
                                    <CardDescription className="text-left">
                                        Your recently uploaded datasets and models
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 border rounded-md"
                                            >
                                                <div>
                                                    <div className="font-medium text-left">
                                                        {i % 2 === 0 ? `Dataset ${i}` : `Model ${i}`}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Uploaded 3 days ago
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-center">
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" /> Upload New
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="billing" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-left">Billing Information</CardTitle>
                                    <CardDescription className="text-left">
                                        Your subscription and payment details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-left">Current Plan</div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-2xl font-bold text-left">Pro Plan</div>
                                            <Badge>Active</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground text-left">$49.99/month</div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-left">Payment Method</div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 border rounded">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-4 w-4"
                                                >
                                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                                    <line x1="2" x2="22" y1="10" y2="10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm">Visa ending in 4242</div>
                                                <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-left">Billing Address</div>
                                        <div className="text-sm text-muted-foreground text-left">
                                            <p>John Doe</p>
                                            <p>123 Main St</p>
                                            <p>San Francisco, CA 94103</p>
                                            <p>United States</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-left">Billing History</CardTitle>
                                    <CardDescription className="text-left">
                                        Your recent invoices and payments
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 border rounded-md"
                                            >
                                                <div>
                                                    <div className="font-medium text-left">Invoice #{1000 + i}</div>
                                                    <div className="text-sm text-muted-foreground text-left">
                                                        April {i}, 2023
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">$49.99</div>
                                                    <Badge variant="outline" className="ml-2">
                                                        Paid
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
