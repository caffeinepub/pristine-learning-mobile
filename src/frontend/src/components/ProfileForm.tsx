import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TeacherProfile } from '../backend';

interface ProfileFormProps {
  profile: Partial<TeacherProfile>;
  onChange: (field: keyof TeacherProfile, value: unknown) => void;
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = React.useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          className="text-sm"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function ProfileForm({ profile, onChange }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Your full name"
          value={profile.fullName || ''}
          onChange={(e) => onChange('fullName', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio / About</Label>
        <Textarea
          id="bio"
          placeholder="Tell students about yourself..."
          value={profile.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="qualifications">Qualifications</Label>
          <Input
            id="qualifications"
            placeholder="e.g. B.Ed, M.Sc"
            value={profile.qualifications || ''}
            onChange={(e) => onChange('qualifications', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="certifications">Certifications</Label>
          <Input
            id="certifications"
            placeholder="e.g. CELTA, TEFL"
            value={profile.certifications || ''}
            onChange={(e) => onChange('certifications', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="experienceYears">Experience (years)</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            placeholder="0"
            value={profile.experienceYears !== undefined ? String(profile.experienceYears) : ''}
            onChange={(e) => onChange('experienceYears', BigInt(parseInt(e.target.value) || 0))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={profile.hourlyRate !== undefined ? String(profile.hourlyRate) : ''}
            onChange={(e) => onChange('hourlyRate', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <TagInput
        label="Subjects Taught"
        value={profile.subjects || []}
        onChange={(v) => onChange('subjects', v)}
        placeholder="e.g. Mathematics"
      />

      <TagInput
        label="Grades Handled"
        value={profile.grades || []}
        onChange={(v) => onChange('grades', v)}
        placeholder="e.g. Grade 8"
      />

      <TagInput
        label="Languages Spoken"
        value={profile.languages || []}
        onChange={(v) => onChange('languages', v)}
        placeholder="e.g. English"
      />

      <div className="space-y-1.5">
        <Label htmlFor="teachingStyle">Teaching Style</Label>
        <Textarea
          id="teachingStyle"
          placeholder="Describe your teaching approach..."
          value={profile.teachingStyle || ''}
          onChange={(e) => onChange('teachingStyle', e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demoVideo">Demo Video URL</Label>
        <Input
          id="demoVideo"
          type="url"
          placeholder="https://youtube.com/..."
          value={profile.demoVideo || ''}
          onChange={(e) => onChange('demoVideo', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <Input
          id="timezone"
          placeholder="e.g. America/New_York"
          value={profile.timezone || ''}
          onChange={(e) => onChange('timezone', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-foreground">Public Profile</p>
          <p className="text-xs text-muted-foreground">Make your profile visible to students</p>
        </div>
        <Switch
          checked={profile.isVisible ?? true}
          onCheckedChange={(v) => onChange('isVisible', v)}
        />
      </div>
    </div>
  );
}
