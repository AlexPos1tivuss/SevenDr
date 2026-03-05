import { Button } from "@/components/ui/button";
import logoSvg from "@/assets/logo.svg";
import { Truck, Shield, Headphones, Package, Users, Award, Clock } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src={logoSvg} alt="Семь Драконов" className="w-20 h-20" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
              Детские игрушки оптом
            </h2>
            <p className="text-lg mb-8 text-white/80 max-w-xl mx-auto">
              Надёжный оптовый поставщик в Беларуси с 2009 года. Сертифицированные товары, прямые поставки, выгодные цены.
            </p>
            <Button
              onClick={() => onNavigate("auth")}
              size="lg"
              className="bg-white text-primary px-10 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors text-base"
            >
              Начать работу
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-gray-500">Клиентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">2000+</div>
              <div className="text-sm text-gray-500">Товаров</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">15 лет</div>
              <div className="text-sm text-gray-500">На рынке</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-gray-500">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-display font-bold text-center text-dark mb-10">
            Почему выбирают нас
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-dark">Быстрая доставка</h4>
              <p className="text-sm text-gray-500">
                Доставка по всей Беларуси. Собственная логистика.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-dark">Сертификация</h4>
              <p className="text-sm text-gray-500">
                Все товары сертифицированы по европейским стандартам.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-dark">Поддержка</h4>
              <p className="text-sm text-gray-500">
                Персональный менеджер для каждого клиента.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-display font-bold text-center text-dark mb-4">
            Свяжитесь с нами
          </h3>
          <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
            Готовы начать сотрудничество? Наши менеджеры помогут подобрать оптимальное решение.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-5 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-1 text-dark text-sm">Адрес</h4>
              <p className="text-sm text-gray-500">г. Минск, ул. Промышленная, 15</p>
            </div>
            <div className="text-center p-5 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-1 text-dark text-sm">Телефон</h4>
              <p className="text-sm text-gray-500">+375 (29) 123-45-67</p>
            </div>
            <div className="text-center p-5 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-1 text-dark text-sm">Email</h4>
              <p className="text-sm text-gray-500">info@seven-dragons.by</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <img src={logoSvg} alt="Семь Драконов" className="w-8 h-8" />
              <span className="font-display font-bold">Семь Драконов</span>
            </div>
            <div className="text-sm text-gray-400 text-center">
              Пн-Пт: 9:00-18:00 | Сб: 10:00-16:00
            </div>
            <div className="text-sm text-gray-400">
              &copy; 2025 ООО "Семь Драконов"
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
