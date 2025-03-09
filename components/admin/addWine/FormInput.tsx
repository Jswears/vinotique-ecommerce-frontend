import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormInputProps {
    label: string
    type: string
    name: string
    value?: string | number
    required?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    step?: string
}

export default function FormInput({ label, type, name, value, required = false, onChange, onKeyDown }: FormInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            {type === "file" ? (
                <Input
                    type={type}
                    name={name}
                    id={name}
                    required={required}
                    onChange={onChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
            ) : name === "description" ? (
                <Textarea name={name} id={name} required={required} onChange={onChange} />
            ) : (
                <Input
                    type={type}
                    name={name}
                    id={name}
                    value={value as string | number}
                    required={required}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            )}
        </div>
    )
}

