import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Profiles from "@/pages/Profiles";
import Profile from "@/pages/Profile";
import ViewProfile from "@/pages/ViewProfile";
import Settings from "@/pages/Settings";
import Matches from "@/pages/Matches";
import Events from "@/pages/Events";
import Login from "@/pages/SimpleLogin";
import SimpleLogin from "@/pages/SimpleLogin";
import Registration from "@/pages/Registration";
import Premium from "@/pages/Premium";
import Payments from "@/pages/Payments";
import ImageTest from "@/pages/ImageTest";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/not-found";
import SetupTest from "@/components/SetupTest";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          {/* Public routes - only accessible to non-authenticated users */}
          <Route path="/">
            <PublicOnlyRoute>
              <Landing />
            </PublicOnlyRoute>
          </Route>
          <Route path="/login">
            <PublicOnlyRoute>
              <SimpleLogin />
            </PublicOnlyRoute>
          </Route>
          <Route path="/registration">
            <PublicOnlyRoute>
              <Registration />
            </PublicOnlyRoute>
          </Route>
          <Route path="/about">
            <AboutUs />
          </Route>

          {/* Setup test route - for development only */}
          <Route path="/setup-test">
            <SetupTest />
          </Route>
          <Route path="/image-test">
            <ImageTest />
          </Route>

          {/* Protected routes - only accessible to authenticated users */}
          <Route path="/home">
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Route>
          <Route path="/profiles">
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          </Route>
          <Route path="/profile">
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Route>
          <Route path="/view-profile/:userId">
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route>
          <Route path="/matches">
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          </Route>
          <Route path="/events">
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          </Route>
          <Route path="/premium">
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          </Route>
          <Route path="/payments">
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}
