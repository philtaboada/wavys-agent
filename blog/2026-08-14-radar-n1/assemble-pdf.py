#!/usr/bin/env python3
"""Arma radar-n1.pdf: tapa encajada + 10 PNG de interior, 1240×1754."""

from __future__ import annotations

import struct
import subprocess
import sys
from pathlib import Path

W, H = 1240, 1754
HERE = Path(__file__).resolve().parent
EXPORT = HERE / "pages" / "export"
TAPA_SRC = HERE / "tapa.png"
TAPA_FIT = EXPORT / "01-tapa.png"
PDF = HERE / "radar-n1.pdf"

INTERIORS = [
    "02-carta-del-editor.png",
    "03-senal.png",
    "04a-tema-central-apertura.png",
    "04b-tema-central-relato.png",
    "04c-tema-central-casos.png",
    "04d-tema-central-cita-datos.png",
    "04e-tema-central-reglas.png",
    "05-mas-noticias.png",
    "08-tablero-ia.png",
    "09-contratapa.png",
]


def png_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"{path.name} no es PNG")
    return struct.unpack(">II", data[16:24])


def fit_tapa() -> None:
    if not TAPA_SRC.exists():
        raise SystemExit(f"Falta {TAPA_SRC}. La tapa LOCK no se regenera.")
    src_w, src_h = png_size(TAPA_SRC)
    if (src_w, src_h) == (W, H):
        TAPA_FIT.write_bytes(TAPA_SRC.read_bytes())
        return
    # Encaje (contain) sobre tinta, sin recortar. No quema tipo sobre la foto.
    from PIL import Image

    img = Image.open(TAPA_SRC).convert("RGB")
    canvas = Image.new("RGB", (W, H), (7, 6, 4))
    scale = min(W / img.width, H / img.height)
    nw, nh = int(round(img.width * scale)), int(round(img.height * scale))
    fitted = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(fitted, ((W - nw) // 2, (H - nh) // 2))
    canvas.save(TAPA_FIT, "PNG")


def main() -> None:
    EXPORT.mkdir(parents=True, exist_ok=True)
    missing = [n for n in INTERIORS if not (EXPORT / n).exists()]
    if missing:
        print("Faltan PNG de interior:", ", ".join(missing), file=sys.stderr)
        print("Corré: bash pages/export-page.sh", file=sys.stderr)
        raise SystemExit(1)
    fit_tapa()
    pages = [TAPA_FIT] + [EXPORT / n for n in INTERIORS]
    if len(pages) != 11:
        raise SystemExit(f"Se esperaban 11 páginas, hay {len(pages)}")
    for p in pages:
        w, h = png_size(p)
        if (w, h) != (W, H):
            raise SystemExit(f"{p.name} mide {w}×{h}, no {W}×{H}")
    subprocess.check_call(
        [
            sys.executable,
            "-m",
            "img2pdf",
            "--pagesize",
            f"{W}x{H}",
            "--imgsize",
            f"{W}x{H}",
            *[str(p) for p in pages],
            "-o",
            str(PDF),
        ]
    )
    print(f"wrote {PDF}  11 pages  {W}x{H}")


if __name__ == "__main__":
    main()
