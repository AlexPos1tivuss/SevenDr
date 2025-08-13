import { Button } from "@/components/ui/button";
import { Truck, Shield, Percent } from "lucide-react";
import logoSvg from "@/assets/logo.svg";
import truckIcon from "@/assets/truck-icon.svg";
import shieldIcon from "@/assets/shield-icon.svg";
import supportIcon from "@/assets/support-icon.svg";

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
                <img src={truckIcon} alt="Быстрая доставка" className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Быстрая доставка</h4>
              <p className="text-gray-600">
                Доставляем заказы по всей Беларуси в кратчайшие сроки. Собственная логистика для надежности.
              </p>
            </div>
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={shieldIcon} alt="Гарантия качества" className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Гарантия качества</h4>
              <p className="text-gray-600">
                Все игрушки сертифицированы и соответствуют европейским стандартам безопасности.
              </p>
            </div>
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={supportIcon} alt="Поддержка 24/7" className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-display font-semibold mb-4 text-dark">Поддержка 24/7</h4>
              <p className="text-gray-600">
                Наша команда всегда готова помочь и ответить на ваши вопросы круглосуточно.
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-display font-bold text-center text-dark mb-12">
            Отзывы наших клиентов
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">АМ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-dark">Анна Михайлова</h4>
                  <p className="text-sm text-gray-500">Детский сад "Солнышко"</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic">
                "Сотрудничаем уже 3 года. Всегда качественные игрушки, быстрая доставка и отличные цены для оптовых закупок."
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">ВС</span>
                </div>
                <div>
                  <h4 className="font-semibold text-dark">Владимир Соколов</h4>
                  <p className="text-sm text-gray-500">Магазин "Детский мир"</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic">
                "Надежный партнер! Широкий ассортимент, конкурентные цены и профессиональный подход к каждому заказу."
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">ЕК</span>
                </div>
                <div>
                  <h4 className="font-semibold text-dark">Елена Кузнецова</h4>
                  <p className="text-sm text-gray-500">Развивающий центр "Умка"</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic">
                "Особенно ценим развивающие игрушки от проверенных производителей. Дети в восторге, родители довольны!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold mb-6">
                О компании "Семь Драконов"
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Мы являемся ведущим оптовым поставщиком детских игрушек в Беларуси с 2009 года. 
                Наша миссия — обеспечить детские учреждения и магазины качественными, безопасными 
                и развивающими игрушками по доступным ценам.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Прямые поставки от производителей
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Все товары сертифицированы
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Гибкая система скидок
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Собственная служба доставки
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8">
                <h4 className="text-2xl font-bold mb-4">Наши преимущества</h4>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">15+</div>
                    <div className="text-sm opacity-80">лет опыта</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm opacity-80">довольных клиентов</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">2000+</div>
                    <div className="text-sm opacity-80">товаров в каталоге</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-80">поддержка клиентов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-dark mb-4">
              Свяжитесь с нами
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Готовы начать сотрудничество? Свяжитесь с нами удобным способом, 
              и наши менеджеры помогут подобрать оптимальное решение для вашего бизнеса.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">📍</span>
              </div>
              <h4 className="font-semibold mb-2 text-dark">Адрес</h4>
              <p className="text-gray-600">г. Минск, ул. Промышленная, 15</p>
              <p className="text-gray-600">офис 301</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary text-2xl">📞</span>
              </div>
              <h4 className="font-semibold mb-2 text-dark">Телефон</h4>
              <p className="text-gray-600">+375 (17) 123-45-67</p>
              <p className="text-gray-600">+375 (29) 123-45-67</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent text-2xl">✉️</span>
              </div>
              <h4 className="font-semibold mb-2 text-dark">Email</h4>
              <p className="text-gray-600">info@seven-dragons.by</p>
              <p className="text-gray-600">sales@seven-dragons.by</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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
