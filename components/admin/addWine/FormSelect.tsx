import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FormSelectProps {
    label: string
    name: string
    options: { value: string; label: string }[]
    value: string | string[]
    onChange: (value: string | string[]) => void;
    multiple?: boolean;

}

export default function FormSelect({ label, name, options, value, onChange, multiple }: FormSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Select name={name} value={Array.isArray(value) ? value[0] : value} onValueChange={(val) => multiple ? onChange([val]) : onChange(val)}>
                <SelectTrigger id={name}>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

