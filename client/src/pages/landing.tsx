import { Button } from "@/components/ui/button";
import { Truck, Shield, Percent } from "lucide-react";
import logoSvg from "@/assets/logo.svg";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-display font-bold mb-6 animate-fade-in">
              Детские игрушки оптом в Минске
            </h2>
            <p className="text-xl mb-8 opacity-90 animate-fade-in">
              Качественные игрушки для счастливого детства. Прямые поставки от производителя с гарантией качества.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => onNavigate("auth")}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 animate-bounce-in"
              >
                Начать работу
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200 animate-bounce-in"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-display font-bold text-center text-dark mb-12">
            Почему выбирают нас?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-primary w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Быстрая доставка</h4>
              <p className="text-gray-600">
                Доставляем заказы по всей Беларуси в кратчайшие сроки. Собственная логистика для надежности.
              </p>
            </div>
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-secondary w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Гарантия качества</h4>
              <p className="text-gray-600">
                Все игрушки сертифицированы и соответствуют европейским стандартам безопасности.
              </p>
            </div>
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Percent className="text-accent w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Выгодные цены</h4>
              <p className="text-gray-600">
                Оптовые цены с прогрессивными скидками. Чем больше заказ, тем выгоднее цена.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-float">
              <div className="text-4xl font-display font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl font-display font-bold text-secondary mb-2">2000+</div>
              <div className="text-gray-600">Наименований товаров</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-display font-bold text-accent mb-2">15</div>
              <div className="text-gray-600">Лет на рынке</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.6s" }}>
              <div className="text-4xl font-display font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">Гарантия качества</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoSvg} alt="Семь Драконов" className="w-10 h-10" />
                <h3 className="text-xl font-display font-bold">Семь Драконов</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Ведущий поставщик детских игрушек в Беларуси. Качество, надежность, выгодные цены.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>📍 г. Минск, ул. Примерная, 1</p>
                <p>📞 +375 (29) 123-45-67</p>
                <p>✉️ info@seven-dragons.by</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• О компании</p>
                <p>• Условия доставки</p>
                <p>• Гарантии</p>
                <p>• Сертификаты</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб: 10:00 - 16:00</p>
                <p>Вс: выходной</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
            <p>&copy; 2025 ООО "Семь Драконов". Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
