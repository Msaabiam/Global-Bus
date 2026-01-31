import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BusTours from "@/pages/BusTours";

function CityTours() {
  return <BusTours category="cities" />;
}

function CampusTours() {
  return <BusTours category="campuses" />;
}

function AllTours() {
  return <BusTours />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/tours/cities" component={CityTours}/>
      <Route path="/tours/campuses" component={CampusTours}/>
      <Route path="/tours" component={AllTours}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
