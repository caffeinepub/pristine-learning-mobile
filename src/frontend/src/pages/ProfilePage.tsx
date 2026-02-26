import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2, Star, CheckCircle, Loader2 } from 'lucide-react';
import { useGetProfile, useUpdateProfile, useCreateProfile } from '../hooks/useQueries';
import ProfileForm from '../components/ProfileForm';
import { TeacherProfile } from '../backend';
import { toast } from 'sonner';

const defaultProfile: TeacherProfile = {
  fullName: '',
  bio: '',
  qualifications: '',
  certifications: '',
  experienceYears: BigInt(0),
  subjects: [],
  grades: [],
  languages: [],
  teachingStyle: '',
  demoVideo: '',
  hourlyRate: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  isVisible: true,
  averageRating: 0,
};

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const createProfile = useCreateProfile();

  const [formData, setFormData] = useState<TeacherProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    } else {
      setFormData({
        ...defaultProfile,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [profile]);

  const handleChange = (field: keyof TeacherProfile, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (profile) {
        await updateProfile.mutateAsync(formData);
      } else {
        await createProfile.mutateAsync(formData);
      }
      setSaved(true);
      toast.success('Profile saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/teacher/${encodeURIComponent(formData.fullName || 'profile')}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const isPending = updateProfile.isPending || createProfile.isPending;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">My Profile</h2>
          <p className="text-xs text-muted-foreground">Manage your teacher profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Rating Display */}
      {profile && profile.averageRating > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-foreground">{profile.averageRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">Average Rating</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-card rounded-xl border border-border shadow-card p-4">
        <ProfileForm profile={formData} onChange={handleChange} />
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full gap-2"
        size="lg"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
        ) : saved ? (
          <><CheckCircle className="w-4 h-4" />Saved!</>
        ) : (
          'Save Profile'
        )}
      </Button>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pristine-learning')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
