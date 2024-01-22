export interface IPortalLaporan {
  kode_barang: string;
  nama_barang: string;
  qrcode: string;
}

export interface ISelectItems {
  label: string;
  value: string;
  group?: string;
  type?: string;
}

export interface ILaporanProduksi {
  shift: string;
  no_plan: string;
  no_bagian: string;
  nama_area: string;
  tanggal: string;
  barang: string;
  operator: string;
  kode_mesin: string;
  satuan: string;
  plan: number;
  start: string;
  finish: string;
  "01": number;
  "02": number;
  "03": number;
  "04": number;
  "05": number;
  "06": number;
  "07": number;
  NG: number;
  OK: number;
  keterangan: string;
  lot: string;
  nama_depan: string;
  nama_belakang: string;
  nama_operator: string;
}

export interface IRencanaProduksi {
  shift: string;
  bagian: string;
  start: string;
  end: string;
  plan_no: string;
}

export interface IRencanaProduksiDetail {
  id: number;
  plan_no: string;
  id_barang: string;
  plan_time: number;
  plan_qty: string;
  mulai: string;
  selesai: string;
  keterangan: string;
  mesin: string;
  nama_barang: string;
}

export interface IKepatuhanPress {
  id: number;
  id_stok_masuk_detail: number;
  nik: string;
  kode_mesin: string;
  karyawan: string;
  proses: string;
  checksheet: number;
  verifikasi_setup: number;
  sensor: number;
  kondisi_sensor: number;
  sop: number;
  kesesuaian_sop: number;
  ear_plug: number;
  sepatu_safety: number;
  ganjal_tombol: number;
  oli_sampah: number;
  line_mesin: number;
  jig_proses: number;
  history_card: number;
  catatan: string;
  tgl: string;
  area: string;
}

export type KepatuhanPressType = "date" | "worker";
