// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
              Ready to Build
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your clean starting point with a modern design system. 
              Start building something amazing.
            </p>
          </div>
          
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Ready for development
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
