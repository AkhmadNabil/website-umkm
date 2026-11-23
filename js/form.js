const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const simpanPrefBtn = document.querySelector("#simpan-preferensi");
const hapusPrefBtn = document.querySelector("#hapus-preferensi");

const fieldIds = ["nama", "email", "whatsapp", "paket", "pesan", "setuju"];
const fields = fieldIds
  .map((id) => document.querySelector(`#${id}`))
  .filter(Boolean);

const topikInputs = document.querySelectorAll('input[name="topik"]');
const waktuInputs = document.querySelectorAll('input[name="waktu"]');

const STORAGE_KEY = "kopi-kuripan-preferensi-kontak";

console.log("P12 fields ditemukan:", fields);

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) {
    return field.type === "checkbox"
      ? "Centang persetujuan terlebih dahulu."
      : "Bagian ini wajib diisi.";
  }
  if (validity.typeMismatch) {
    return "Format data belum sesuai (contoh: nama@email.com).";
  }
  if (validity.tooShort) {
    return `Isi minimal ${field.minLength} karakter.`;
  }
  if (validity.patternMismatch) {
    return "Format nomor belum sesuai (gunakan 08... atau +628..., 9-14 digit).";
  }

  return "";
}

function tampilkanError(field, pesan) {
  const errorEl = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (errorEl) {
    errorEl.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiRadioGroup(inputs, errorId, pesanError) {
  const list = Array.from(inputs);
  if (list.length === 0) return true;

  const terpilih = list.some((input) => input.checked);
  const errorEl = document.querySelector(`#${errorId}`);

  list.forEach((input) => {
    input.setAttribute("aria-invalid", terpilih ? "false" : "true");
  });

  if (errorEl) {
    errorEl.textContent = terpilih ? "" : pesanError;
  }

  return terpilih;
}

function tampilkanPreview() {
  if (!form || !preview || !formFeedback) return;

  const data = new FormData(form);
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("whatsapp") || "-"}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu: ${data.get("waktu")}`,
    `Pesan: ${data.get("pesan")}`,
    `Setuju preview: ${data.get("setuju") ? "Ya" : "Tidak"}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

function simpanPreferensi() {
  if (!form) return;

  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket") || "",
    topik: data.get("topik") || "",
    waktu: data.get("waktu") || "",
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));

  if (formFeedback) {
    formFeedback.textContent = "Preferensi kontak tersimpan di localStorage.";
    formFeedback.classList.add("success");
  }
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    const paketSelect = document.querySelector("#paket");
    if (paketSelect && preferensi.paket) {
      paketSelect.value = preferensi.paket;
    }

    if (preferensi.topik) {
      const topikRadio = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
      if (topikRadio) topikRadio.checked = true;
    }

    if (preferensi.waktu) {
      const waktuRadio = document.querySelector(`input[name="waktu"][value="${preferensi.waktu}"]`);
      if (waktuRadio) waktuRadio.checked = true;
    }
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function hapusPreferensi() {
  localStorage.removeItem(STORAGE_KEY);
  if (formFeedback) {
    formFeedback.textContent = "Preferensi kontak dihapus dari localStorage.";
    formFeedback.classList.remove("success");
  }
}

if (form) {
  fields.forEach((field) => {
    field.addEventListener("input", () => validasiField(field));
    field.addEventListener("change", () => validasiField(field));
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", () =>
      validasiRadioGroup(topikInputs, "topik-error", "Pilih salah satu topik pertanyaan.")
    );
  });

  waktuInputs.forEach((input) => {
    input.addEventListener("change", () =>
      validasiRadioGroup(waktuInputs, "waktu-error", "Pilih salah satu waktu.")
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const semuaFieldValid = fields.every((field) => validasiField(field));
    const topikValid = validasiRadioGroup(
      topikInputs,
      "topik-error",
      "Pilih salah satu topik pertanyaan."
    );
    const waktuValid = validasiRadioGroup(
      waktuInputs,
      "waktu-error",
      "Pilih salah satu waktu."
    );

    if (!semuaFieldValid || !topikValid || !waktuValid || !form.checkValidity()) {
      if (formFeedback) {
        formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
        formFeedback.classList.remove("success");
      }
      if (preview) {
        preview.textContent = "Preview belum ditampilkan karena masih ada data yang belum valid.";
      }
      form.reportValidity();
      const firstInvalid = form.querySelector(':invalid, [aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    tampilkanPreview();
  });

  simpanPrefBtn?.addEventListener("click", simpanPreferensi);
  hapusPrefBtn?.addEventListener("click", hapusPreferensi);

  document.addEventListener("DOMContentLoaded", muatPreferensi);
  muatPreferensi();
}