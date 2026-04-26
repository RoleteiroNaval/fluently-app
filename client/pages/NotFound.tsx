import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FluentlyButton } from "@/components/FluentlyButton";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-fluently-vertical flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-gradient-fluently">404</h1>
        <p className="text-xl text-fluently-text mb-2">Página não encontrada</p>
        <p className="text-fluently-text-muted mb-8">
          Desculpe, a página que você está procurando não existe.
        </p>
        <FluentlyButton
          fullWidth
          size="lg"
          onClick={() => navigate("/")}
        >
          Voltar ao Início
        </FluentlyButton>
      </div>
    </div>
  );
};

export default NotFound;
