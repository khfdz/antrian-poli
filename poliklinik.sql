-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 03, 2025 at 09:46 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sikkrw`
--

-- --------------------------------------------------------

--
-- Table structure for table `poliklinik`
--

CREATE TABLE `poliklinik` (
  `kd_poli` char(5) NOT NULL DEFAULT '',
  `nm_poli` varchar(50) DEFAULT NULL,
  `registrasi` double NOT NULL,
  `registrasilama` double NOT NULL,
  `status` enum('0','1') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `poliklinik`
--

INSERT INTO `poliklinik` (`kd_poli`, `nm_poli`, `registrasi`, `registrasilama`, `status`) VALUES
('-', '-', 0, 0, '1'),
('001', 'POLIKLINIK OBSGYN/KANDUNGAN I', 40000, 40000, '1'),
('002', 'POLIKLINIK ANAK I', 40000, 40000, '1'),
('003', 'POLIKLINIK UROLOGI', 40000, 40000, '1'),
('004', 'POLIKLINIK UMUM', 40000, 40000, '1'),
('005', 'POLIKLINIK SYARAF', 40000, 40000, '1'),
('006', 'POLIKLINIK REHABILITASI MEDIK', 40000, 40000, '1'),
('007', 'POLIKLINIK FISIOTERAPI', 40000, 40000, '1'),
('008', 'POLIKLINIK MATA', 40000, 40000, '1'),
('009', 'POLIKLINIK THT', 40000, 40000, '1'),
('010', 'POLIKLINIK KULIT & KELAMIN', 40000, 40000, '1'),
('011', 'POLIKLINIK INTERNIST I', 40000, 40000, '1'),
('012', 'POLIKLINIK GIGI 1', 40000, 40000, '1'),
('013', 'POLIKLINIK BEDAH MULUT', 40000, 40000, '1'),
('014', 'POLIKLINIK BEDAH PLASTIK', 40000, 40000, '1'),
('015', 'POLIKLINIK ORTHOPEDY', 40000, 40000, '1'),
('016', 'POLIKLINIK BEDAH UMUM', 40000, 40000, '1'),
('017', 'POLIKLINIK PARU', 40000, 40000, '1'),
('018', 'UGD', 0, 0, '0'),
('019', 'UNIT RADIOLOGI', 0, 0, '1'),
('020', 'PHARMACY', 0, 0, '0'),
('021', 'POLIKLINIK ANASTHESI', 40000, 40000, '1'),
('022', 'UNIT LABORATORIUM', 0, 0, '1'),
('023', 'AKUPUNTUR ', 0, 0, '0'),
('024', 'MCU', 0, 0, '1'),
('025', 'ICU', 0, 0, '0'),
('026', 'OK', 0, 0, '0'),
('027', 'VK', 0, 0, '0'),
('028', 'HCU/INTERMEDIATE', 0, 0, '0'),
('029', 'AMBULANCE', 0, 0, '0'),
('030', 'POLIKLINIK GIZI', 40000, 40000, '1'),
('031', 'PERINA I', 0, 0, '0'),
('032', 'POLIKLINIK ANAK II', 40000, 40000, '1'),
('033', 'MEDICAL RECORD', 0, 0, '0'),
('034', 'PERINA II', 0, 0, '0'),
('035', 'KASIR', 0, 0, '0'),
('036', 'ADM RWI', 0, 0, '0'),
('037', 'POLIKLINIK BEDAH SYARAF', 40000, 40000, '1'),
('038', 'POLIKLINIK JANTUNG DAN PEMBULUH', 40000, 40000, '1'),
('039', 'POLIKLINIK BEDAH DIGESTIF', 40000, 40000, '1'),
('040', 'DOKTER JAGA RWI', 0, 0, '0'),
('041', 'POLIKLINIK GIGI 2', 40000, 40000, '1'),
('042', 'RWI LT5', 0, 0, '0'),
('043', 'POLI JANTUNG EKSEKUTIF', 60000, 60000, '1'),
('044', 'POLIKLINIK OBSGYN/KANDUNGAN II', 40000, 40000, '1'),
('045', 'HRD', 0, 0, '0'),
('046', 'INTEL', 0, 0, '0'),
('047', 'P3K', 0, 0, '0'),
('048', 'NICU', 0, 0, '0'),
('049', 'POLIKLINIK ANAK III', 40000, 40000, '1'),
('050', 'POLIKLINIK DOTS', 0, 0, '1'),
('051', 'POLIKLINIK  KANDUNGAN EKSEKUTIF', 60000, 60000, '1'),
('052', 'POLIKLINIK INTERNIST EKSEKUTIF', 60000, 60000, '1'),
('053', 'CLEANING SERVICE', 0, 0, '0'),
('054', 'CASEMIX', 0, 0, '0'),
('055', 'RWI LT6', 0, 0, '0'),
('056', 'HOME VISIT', 0, 0, '1'),
('057', 'TELEKONSUL', 0, 0, '1'),
('058', 'POLIKLINIK ANAK EKSEKUTIF', 60000, 60000, '1'),
('059', 'NEOUROLOGY', 0, 0, '0'),
('060', 'PATOLOGI KLINIK', 0, 0, '0'),
('061', 'PATOLOGI ANATOMI', 0, 0, '0'),
('062', 'POLIKLINIK  GIGI EKSEKUTIF', 60000, 60000, '1'),
('063', 'POLIKLINIK  INTERNIST EKSEKUTIF', 0, 0, '0'),
('064', 'ICU COVID', 0, 0, '0'),
('065', 'KOMITE KEPERAWATAN', 0, 0, '0'),
('066', 'REHABILITASI MEDIK 1', 0, 0, '0'),
('IGDK', 'Unit IGD', 40000, 40000, '1'),
('U0069', 'TRANSIT ', 0, 0, '1'),
('U0070', 'POLIKLINIK KELUARGA', 0, 0, '1'),
('U0071', 'POLIKLINIK TERAPI WICARA', 40000, 40000, '1'),
('U0072', 'POLIKLINIK ANAK IV', 40000, 40000, '1'),
('U0073', 'POLI ANAK II', 40000, 40000, '0'),
('U0074', 'POLI ANAK III', 40000, 40000, '0'),
('U0075', 'POLIKLINIK INTERNIST II', 40000, 40000, '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `poliklinik`
--
ALTER TABLE `poliklinik`
  ADD PRIMARY KEY (`kd_poli`),
  ADD KEY `nm_poli` (`nm_poli`),
  ADD KEY `registrasi` (`registrasi`),
  ADD KEY `registrasilama` (`registrasilama`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
