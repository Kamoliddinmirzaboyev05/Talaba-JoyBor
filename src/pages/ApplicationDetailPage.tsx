import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Home,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Phone,
    FileText,
    Building,
    User,
    MessageSquare,
    Download,
    Eye,
    Mail,
} from "lucide-react";
import { Application } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { authAPI } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";

const ApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sahifa yuklanganda yuqoriga scroll qilish
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // API dan ariza ma'lumotlarini yuklash
    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) {
                setError("Ariza ID topilmadi");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Bu yerda real API chaqiruvi bo'lishi kerak
                // Hozircha barcha arizalarni olib, kerakli arizani topamiz
                const applications = await authAPI.getApplications();
                const foundApplication = applications.find(app => app.id.toString() === id);

                if (foundApplication) {
                    setApplication(foundApplication);
                } else {
                    setError("Ariza topilmadi");
                }
            } catch (error) {
                console.error("Ariza yuklanmadi:", error);
                setError("Ariza yuklanishda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        if (user && id) {
            fetchApplication();
        }
    }, [user, id]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Tizimga kirish talab etiladi
                    </h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                        Tizimga kirish
                    </button>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case "PENDING":
                return <Clock className="w-6 h-6 text-yellow-500" />;
            case "REJECTED":
                return <XCircle className="w-6 h-6 text-red-500" />;
            case "INTERVIEW":
                return <AlertCircle className="w-6 h-6 text-blue-500" />;
            case "COMPLETED":
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            default:
                return <Clock className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Tasdiqlangan";
            case "PENDING":
                return "Kutilmoqda";
            case "REJECTED":
                return "Rad etilgan";
            case "INTERVIEW":
                return "Suhbat";
            case "COMPLETED":
                return "Yakunlangan";
            default:
                return "Noma'lum";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
            case "REJECTED":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
            case "INTERVIEW":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Sizning arizangiz tasdiqlandi! Tez orada siz bilan bog'lanishadi.";
            case "PENDING":
                return "Arizangiz ko'rib chiqilmoqda. Iltimos, sabr qiling.";
            case "REJECTED":
                return "Afsuski, arizangiz rad etildi. Boshqa yotoqxonalarga ariza yuborishingiz mumkin.";
            case "INTERVIEW":
                return "Siz suhbatga taklif qilindingiz. Tez orada siz bilan bog'lanishadi.";
            case "COMPLETED":
                return "Jarayon yakunlandi. Barcha kerakli hujjatlar rasmiylashtirildi.";
            default:
                return "Ariza holati haqida ma'lumot yo'q.";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Ariza ma'lumotlari yuklanmoqda...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Xatolik yuz berdi
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {error || "Ariza topilmadi"}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/applications")}
                            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200"
                        >
                            Arizalar ro'yxatiga qaytish
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/applications')}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Arizalar ro'yxatiga qaytish
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-teal-600" />
                            Ariza Tafsilotlari
                        </h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Ariza ID</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">#{application.id}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`rounded-2xl shadow-lg p-6 border-2 ${getStatusColor(application.status)}`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {getStatusIcon(application.status)}
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {getStatusText(application.status)}
                                    </h2>
                                    <p className="text-sm opacity-80">
                                        {getStatusDescription(application.status)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Jarayon</span>
                                    <span>
                                        {application.status === 'PENDING' ? '25%' :
                                            application.status === 'INTERVIEW' ? '75%' :
                                                application.status === 'APPROVED' || application.status === 'COMPLETED' ? '100%' :
                                                    application.status === 'REJECTED' ? '100%' : '0%'}
                                    </span>
                                </div>
                                <div className="w-full bg-white/30 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${application.status === 'PENDING' ? 'bg-yellow-600 w-1/4' :
                                            application.status === 'INTERVIEW' ? 'bg-blue-600 w-3/4' :
                                                application.status === 'APPROVED' || application.status === 'COMPLETED' ? 'bg-green-600 w-full' :
                                                    application.status === 'REJECTED' ? 'bg-red-600 w-full' : 'bg-gray-400 w-0'
                                            }`}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Dormitory Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Home className="w-5 h-5 text-teal-600" />
                                Yotoqxona Ma'lumotlari
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {application.dormitory?.name || 'Yotoqxona nomi'}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {application.dormitory?.university?.name || application.university || 'Universitet'}
                                    </p>
                                </div>

                                {application.dormitory?.address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {application.dormitory.address}
                                        </p>
                                    </div>
                                )}

                                {application.dormitory?.description && (
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {application.dormitory.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-teal-600" />
                                Shaxsiy Ma'lumotlar
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        To'liq ism
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-semibold">
                                        {application.fio} {application.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Telefon raqam
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            +{application.phone}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Manzil
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {application.city}, {application.village}
                                        </p>
                                    </div>
                                </div>

                                {application.passport && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Pasport raqami
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <p className="text-gray-900 dark:text-white font-semibold">
                                                {application.passport}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Academic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-teal-600" />
                                O'quv Ma'lumotlari
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {application.faculty && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Fakultet
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {application.faculty}
                                        </p>
                                    </div>
                                )}

                                {application.direction && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Yo'nalish
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {application.direction}
                                        </p>
                                    </div>
                                )}

                                {application.course && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Kurs
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {application.course}-kurs
                                        </p>
                                    </div>
                                )}

                                {application.group && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Guruh
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {application.group}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Comment */}
                        {application.comment && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-teal-600" />
                                    Qo'shimcha Izoh
                                </h3>

                                <div className={`p-4 rounded-xl border-l-4 border-teal-500 ${theme === "dark"
                                    ? "text-gray-300 bg-gray-700"
                                    : "text-gray-700 bg-gray-50"
                                    }`}>
                                    <p>{application.comment}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-teal-600" />
                                Vaqt Jadvali
                            </h3>

                            <div className="space-y-4">
                                {application.created_at && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Ariza yuborildi
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(application.created_at).toLocaleDateString("uz-UZ", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${application.status === 'PENDING' ? 'bg-yellow-500' :
                                        application.status === 'INTERVIEW' ? 'bg-blue-500' :
                                            application.status === 'APPROVED' ? 'bg-green-500' :
                                                application.status === 'REJECTED' ? 'bg-red-500' :
                                                    'bg-gray-400'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {getStatusText(application.status)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Joriy holat
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Harakatlar
                            </h3>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.print()}
                                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    <Download className="w-5 h-5" />
                                    <span className="font-medium">Chop etish</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/listing/${application.dormitory?.id || ''}`)}
                                    className="w-full flex items-center gap-3 p-3 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
                                >
                                    <Eye className="w-5 h-5" />
                                    <span className="font-medium">Yotoqxonani ko'rish</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/messages")}
                                    className="w-full flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">Xabar yuborish</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-green-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-xl">📞</span>
                                Yordam Kerakmi?
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Agar savollaringiz bo'lsa, biz bilan bog'laning
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/contact")}
                                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                            >
                                Bog'lanish
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;