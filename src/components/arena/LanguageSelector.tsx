import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const handleChange = (value: string) => {
    onLanguageChange(value);
  };

  return (
    <div className="flex justify-end ">
      <Select onValueChange={handleChange} defaultValue="java">
        <SelectTrigger className="w-[98px] h-8 text-xs p-2 border-none focus:border-none">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem> */}
            <SelectItem value="java">java</SelectItem>
            {/* <SelectItem value="cpp">C++</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
