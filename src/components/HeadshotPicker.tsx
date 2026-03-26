import { createSignal, Show, onMount } from 'solid-js';
import { User as UserIcon } from 'lucide-solid';
import { getGoogleProfilePicture, uploadHeadshot, setHeadshotFromGoogle } from '../services/providerService';

interface HeadshotPickerProps {
  username: string;
  currentHeadshot?: string;
  onHeadshotChanged: (url: string) => void;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function HeadshotPicker(props: HeadshotPickerProps) {
  const [googlePicUrl, setGooglePicUrl] = createSignal<string | null>(null);
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
  const [isUploading, setIsUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const url = await getGoogleProfilePicture(props.username);
      setGooglePicUrl(url);
    } catch (e) {
      console.warn('Could not fetch Google profile picture:', e);
    }
  });

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadHeadshot(props.username, file);
      props.onHeadshotChanged(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseGooglePic = async () => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await setHeadshotFromGoogle(props.username);
      props.onHeadshotChanged(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to use Google photo');
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = () => previewUrl() || props.currentHeadshot || null;

  return (
    <div class="text-center">
      <h3 class="text-lg font-semibold text-card-foreground mb-1">
        {props.currentHeadshot ? 'Update Profile Photo' : 'Add a Profile Photo'}
      </h3>
      <p class="text-sm text-muted-foreground mb-6">
        Choose a photo that clients will see when booking
      </p>

      <Show when={displayUrl()}>
        <div class="mb-6">
          <img
            src={displayUrl()!}
            alt="Profile photo preview"
            class="w-24 h-24 rounded-full object-cover border-2 border-primary/20 mx-auto"
          />
          <Show when={props.currentHeadshot && !previewUrl()}>
            <p class="text-xs text-muted-foreground mt-2">Current photo</p>
          </Show>
        </div>
      </Show>

      <Show when={!displayUrl()}>
        <div class="mb-6">
          <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
            <UserIcon class="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
      </Show>

      <div class="flex gap-4 justify-center mb-6">
        <Show when={googlePicUrl()}>
          <button
            onClick={handleUseGooglePic}
            disabled={isUploading()}
            class="border-2 border-primary/30 rounded-xl p-4 w-40 cursor-pointer hover:border-primary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src={googlePicUrl()!}
              alt="Google profile"
              class="w-16 h-16 rounded-full object-cover mx-auto mb-2"
            />
            <div class="font-semibold text-sm">Use Google Photo</div>
            <div class="text-xs text-muted-foreground mt-1">Your current profile picture</div>
          </button>
        </Show>

        <label
          class={`border-2 border-dashed border-muted-foreground/30 rounded-xl p-4 w-40 cursor-pointer hover:border-muted-foreground/60 transition-colors ${isUploading() ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
            <span class="text-2xl text-muted-foreground">+</span>
          </div>
          <div class="font-semibold text-sm">Upload Photo</div>
          <div class="text-xs text-muted-foreground mt-1">JPG or PNG, max 5MB</div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            class="hidden"
            onChange={handleFileSelect}
            disabled={isUploading()}
          />
        </label>
      </div>

      <Show when={isUploading()}>
        <p class="text-sm text-muted-foreground mb-4">Uploading...</p>
      </Show>

      <Show when={error()}>
        <p class="text-sm text-red-600 mb-4">{error()}</p>
      </Show>

      <Show when={props.showSkip && props.onSkip}>
        <button
          onClick={props.onSkip}
          class="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
        >
          Skip for now
        </button>
      </Show>
    </div>
  );
}
