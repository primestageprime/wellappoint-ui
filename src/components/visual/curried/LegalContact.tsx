interface LegalContactProps {
  email: string;
  phone?: string;
  website?: string;
}

export function LegalContact(props: LegalContactProps) {
  return (
    <section class="pt-4 border-t border-[#8B6914]/20">
      <p class="text-sm text-[#5a4510]">
        If you have any questions, you can contact us:
      </p>
      <ul class="text-sm text-[#5a4510] mt-2 space-y-1">
        <li>
          By email:{' '}
          <a href={`mailto:${props.email}`} class="text-[#8B6914] underline">
            {props.email}
          </a>
        </li>
        {props.phone && (
          <li>
            By phone:{' '}
            <a href={`tel:${props.phone}`} class="text-[#8B6914] underline">
              {props.phone}
            </a>
          </li>
        )}
        {props.website && (
          <li>
            By visiting:{' '}
            <a href={props.website} target="_blank" rel="noopener noreferrer" class="text-[#8B6914] underline">
              {props.website}
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}

