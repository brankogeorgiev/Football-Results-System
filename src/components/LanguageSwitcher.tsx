import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/i18n/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const currentFlag = language === "mk" ? "🇲🇰" : "🇬🇧";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change language" className="text-xl">
          {currentFlag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("mk")}
          className={language === "mk" ? "bg-accent" : ""}
        >
          🇲🇰 Македонски
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
