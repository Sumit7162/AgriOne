
"use client";

import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/context/language-context";
import { Bell, Edit, User } from "lucide-react";

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <>
            <Header>{t('settings.title')}</Header>
            <div className="flex-1 p-4 md:p-8">
                <div className="grid gap-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <User className="w-6 h-6 text-primary" />
                                <CardTitle className="font-headline">{t('settings.profile_title')}</CardTitle>
                            </div>
                            <CardDescription>{t('settings.profile_description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('settings.name_label')}</Label>
                                    <Input id="name" defaultValue="Ramesh Kumar" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('settings.email_label')}</Label>
                                    <Input id="email" type="email" defaultValue="ramesh.k@example.com" disabled />
                                </div>
                            </div>
                             <div className="flex justify-end">
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('settings.edit_profile_button')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Bell className="w-6 h-6 text-primary" />
                                <CardTitle className="font-headline">{t('settings.notifications_title')}</CardTitle>
                            </div>
                            <CardDescription>{t('settings.notifications_description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex items-center space-x-2">
                                <Checkbox id="pest-alerts" defaultChecked />
                                <label
                                    htmlFor="pest-alerts"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('settings.pest_alerts_label')}
                                </label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="weather-warnings" defaultChecked />
                                <label
                                    htmlFor="weather-warnings"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('settings.weather_warnings_label')}
                                </label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="marketplace-updates" />
                                <label
                                    htmlFor="marketplace-updates"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('settings.marketplace_updates_label')}
                                </label>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button>{t('settings.save_preferences_button')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
