import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <img 
        src="/assets/images/Symbol.png" 
        alt="Kaysha Styles Symbol" 
        className="h-16 mb-6 opacity-50" 
      />
      <h1 className="heading-xl mb-4">Page Not Found</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        We're sorry, but the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="btn-primary">
          <Link to="/">Return to Homepage</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
