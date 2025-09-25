'use client';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";

const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'as', label: 'অসমীয়া (Assamese)' },
    { value: 'mai', label: 'मैथिली (Maithili)' },
];


export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const selectedLanguageLabel = languages.find(lang => lang.value === language)?.label.split(' ')[0] || 'Language';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-4 w-4" />
           <span className="sr-only">{selectedLanguageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(lang => (
            <DropdownMenuItem key={lang.value} onClick={() => setLanguage(lang.value as any)}>
                {lang.label}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
