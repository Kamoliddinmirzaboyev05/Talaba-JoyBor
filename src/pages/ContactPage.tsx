import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageCircle, Facebook, Instagram } from 'lucide-react';
import Header from '../components/Header';
import YandexMap from '../components/YandexMap';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
	const navigate = useNavigate();
	// Sahifa yuklanganda yuqoriga scroll qilish
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	// Aloqa formasi endi qayta foydalaniladigan komponent orqali render qilinadi

	const contactInfo = [
		{
			icon: Phone,
			title: 'Telefon',
			details: ['+998 88 956 38 48'],
			color: 'from-green-500 to-green-600'
		},
		{
			icon: MessageCircle,
			title: 'Telegram Bot',
			details: ['@Joyboronlinebot'],
			color: 'from-blue-500 to-blue-600'
		},
		{
			icon: MapPin,
			title: 'Manzil',
			details: ["Toshkent sh., O'zbekiston"],
			color: 'from-purple-500 to-purple-600'
		},
		{
			icon: Clock,
			title: 'Ish vaqti',
			details: ['24/7 Onlayn Xizmat'],
			color: 'from-orange-500 to-orange-600'
		}
	];

	const socialLinks = [
		{ icon: MessageCircle, label: 'Telegram Bot', url: 'https://t.me/Joyboronlinebot', color: 'text-blue-500' },
		{ icon: Instagram, label: 'Instagram', url: 'https://instagram.com/joybor', color: 'text-pink-500' },
		{ icon: Facebook, label: 'Facebook', url: 'https://facebook.com/joybor', color: 'text-blue-600' }
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Header />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<MessageCircle className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Biz Bilan Bog'laning
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Savollaringiz bormi? Yordam kerakmi? Biz sizga yordam berishga tayyormiz!
					</p>
				</motion.div>

				{/* Contact Info Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
				>
					{contactInfo.map((info, index) => (
						<motion.div
							key={info.title}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
						>
							<div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-4`}>
								<info.icon className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
								{info.title}
							</h3>
							<div className="space-y-1">
								{info.details.map((detail, idx) => (
									<p key={idx} className="text-gray-600 dark:text-gray-300 text-sm">
										{detail}
									</p>
								))}
							</div>
						</motion.div>
					))}
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<ContactForm />
					</motion.div>

					{/* Additional Info */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="space-y-8"
					>
						{/* FAQ Link */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
								Tez-tez So'raladigan Savollar
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-6">
								Ehtimol, sizning savolingizga javob allaqachon mavjud bo'lishi mumkin.
							</p>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => navigate('/help')}
								className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200"
							>
								FAQ Bo'limiga O'tish
							</motion.button>
						</div>

						{/* Social Media */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
								Ijtimoiy Tarmoqlarda Kuzating
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-6">
								Yangiliklar va foydali ma'lumotlar uchun bizni kuzatib boring.
							</p>
							<div className="flex gap-4">
								{socialLinks.map((social) => (
									<motion.a
										key={social.label}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${social.color}`}
									>
										<social.icon className="w-6 h-6" />
									</motion.a>
								))}
							</div>
						</div>

						{/* Emergency Contact */}
						<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
							<h3 className="text-xl font-semibold mb-4">
								Shoshilinch Yordam
							</h3>
							<p className="text-red-100 mb-4">
								Agar sizda shoshilinch muammo bo'lsa, quyidagi raqamga qo'ng'iroq qiling:
							</p>
							<div className="flex items-center gap-3">
								<Phone className="w-5 h-5" />
								<span className="text-xl font-semibold">+998 71 123 45 67</span>
							</div>
							<p className="text-red-100 text-sm mt-2">
								24/7 mavjud
							</p>
						</div>

						{/* Map */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
								Bizning Joylashuvimiz
							</h3>
							<div className="rounded-xl overflow-hidden">
								<YandexMap
									height="240px"
									balloonContent="Codial Academy"
								/>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
								Toshkent sh., Chilonzor t., Bunyodkor ko'chasi, 12-uy
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;