import { Link } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";
import defuturesLogo from "@/assets/defutures-logo.png";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={defuturesLogo} alt="DeFutures" className="h-8 w-8" />
              <span className="font-bold text-lg">DeFutures</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Democratizing prediction markets for everyone. Make informed bets on the future.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://x.com/DeFuturesx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@defutures.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Markets */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Markets</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/markets/sports" className="hover:text-foreground transition-colors">Sports</Link></li>
              <li><Link to="/markets/politics" className="hover:text-foreground transition-colors">Politics</Link></li>
              <li><Link to="/markets/crypto" className="hover:text-foreground transition-colors">Crypto</Link></li>
              <li><Link to="/markets/entertainment" className="hover:text-foreground transition-colors">Entertainment</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How it Works</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-muted-foreground">
              © 2025 DeFutures. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built for Fluent Testnet • Frontend Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };