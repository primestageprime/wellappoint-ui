export function Footer() {
  return (
    <footer class="w-full py-4 mt-8 border-t border-[#8B6914]/20">
      <div class="max-w-screen-2xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm text-[#5a4510]">
        <span class="text-[#8B6914]/60">© {new Date().getFullYear()} PrimeStage</span>
        <div class="flex gap-4">
          <a 
            href="/privacy"
            class="hover:text-[#8B6914] transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms"
            class="hover:text-[#8B6914] transition-colors"
          >
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}

