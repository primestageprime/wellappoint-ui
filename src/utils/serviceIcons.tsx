import { type JSX } from 'solid-js';
import { 
  PrimaryHeart,
  PrimaryCraniosacral,
  PrimaryFootReflexology,
} from '../components/visual';

/**
 * Maps service names to their corresponding icon components
 * Returns undefined if no specific icon exists for the service
 */
export function getServiceIcon(serviceName: string): JSX.Element | undefined {
  switch (serviceName) {
    case 'Massage':
      return <PrimaryHeart />;
    case 'Cranial Sacral Massage':
      return <PrimaryCraniosacral />;
    case 'Reflexology':
      return <PrimaryFootReflexology />;
    default:
      return undefined;
  }
}

/**
 * Gets a service icon or falls back to a default heart icon
 */
export function getServiceIconWithFallback(serviceName: string): JSX.Element {
  return getServiceIcon(serviceName) || <PrimaryHeart />;
}

