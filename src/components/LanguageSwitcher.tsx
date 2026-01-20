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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" title="Change language" className="gap-2 px-2">
          {language === "mk" ? (
            <>
              <img src="https://flagcdn.com/w40/mk.png" alt="MK" className="w-6 h-4 object-cover rounded-sm" />
              <span>MK</span>
            </>
          ) : (
            <>
              <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-6 h-4 object-cover rounded-sm" />
              <span>EN</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("mk")}
          className={language === "mk" ? "bg-accent" : ""}
        >
          <img src="https://flagcdn.com/w40/mk.png" alt="MK" className="w-5 h-3 object-cover rounded-sm mr-2" />
          Македонски
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-5 h-3 object-cover rounded-sm mr-2" />
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
