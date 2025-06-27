import { BoosterPack, Card, regionRanges, specialFormRegionMapping } from "./Interfaces";

export const themedPacks: BoosterPack[] = [
  {
    id: 'mystery',
    name: 'Mystery',
    filter: () => true,
    weights: {
      Common: 40,
      Uncommon: 25,
      Rare: 15,
      Epic: 10,
      Legendary: 7,
      Mythical: 3,
    },
    carouselCards: ['Mew-151', 'Rayquaza-384', 'Garchomp-445', 'Pikachu-25', 'Gholdengo-1000', 'Melmetal-809'],
    chaseCard: 'Melmetal-809',
  },
  {
    id: '151',
    name: 'Original 151',
    filter: (card: Card) => {
      const [start, end] = regionRanges['Kanto'] || [0, 0];
      return card.number >= start && card.number <= end && !card.variant;
    },
    carouselCards: ['Bulbasaur-1', 'Charizard-6', 'Pikachu-25', 'Arcanine-58', 'Gengar-94', 'Snorlax-143', 'Dragonite-149', 'Mewtwo-150', 'Mew-151'],
    chaseCard: 'Mew-151',
  },
  {
    id: 'johto',
    name: 'Johto',
    filter: (card: Card) => {
      const [johtoStart, johtoEnd] = regionRanges['Johto'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return card.number >= johtoStart && card.number <= johtoEnd && (!card.variant || variantRegions.includes('Johto'));
    },
    carouselCards: ['Chikorita-152', 'Typhlosion-157', 'Feraligatr-160', 'Togepi-175', 'Espeon-196', 'Suicune-245', 'Lugia-249', 'Celebi-251'],
    chaseCard: 'Celebi-251',
  },
  {
    id: 'hoenn',
    name: 'Hoenn',
    filter: (card: Card) => {
      const [hoennStart, hoennEnd] = regionRanges['Hoenn'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return card.number >= hoennStart && card.number <= hoennEnd && (!card.variant || variantRegions.includes('Hoenn'));
    },
    carouselCards: ['Treecko-252', 'Blaziken-257', 'Swampert-260', 'Gardevoir-282', 'Kyogre-382', 'Groudon-383', 'Mega Rayquaza-384'],
    chaseCard: 'Mega Rayquaza-384',
  },
  {
    id: 'sinnoh',
    name: 'Sinnoh',
    filter: (card: Card) => {
      const [sinnohStart, sinnohEnd] = regionRanges['Sinnoh'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return (
        (card.number >= sinnohStart && card.number <= sinnohEnd && (!card.variant || variantRegions.includes('Sinnoh'))));
    },
    carouselCards: ['Turtwig-387', 'Infernape-392', 'Empoleon-395', 'Garchomp-445', 'Lucario-448', 'Arceus-493'],
    chaseCard: 'Arceus-493',
  },
  {
    id: 'unova',
    name: 'Unova',
    filter: (card: Card) => {
      const [unovaStart, unovaEnd] = regionRanges['Unova'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return card.number >= unovaStart && card.number <= unovaEnd && (!card.variant || variantRegions.includes('Unova'));
    },
    carouselCards: ['Snivy-495', 'Emboar-500', 'Samurott-503', 'Zoroark-571', 'Volcarona-637', 'Reshiram-643', 'Zekrom-644', 'Meloetta-648'],
    chaseCard: 'Meloetta-648',
  },
  {
    id: 'kalos',
    name: 'Kalos',
    filter: (card: Card) => {
      const [kalosStart, kalosEnd] = regionRanges['Kalos'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return (
        (card.number >= kalosStart && card.number <= kalosEnd && (!card.variant || variantRegions.includes('Kalos') || variantRegions.includes('KalosZen'))) ||
        variantRegions.includes('Kalos')
      );
    },
    carouselCards: ['Chespin-650', 'Delphox-655', 'Greninja-658', 'Aegislash-681', 'Sylveon-700', 'Mega Charizard X-6', 'Xerneas-716', 'Zygarde (Complete)-718'],
    chaseCard: 'Zygarde (Complete)-718',
  },
  {
    id: 'alola',
    name: 'Alola',
    filter: (card: Card) => {
      const [alolaStart, alolaEnd] = regionRanges['Alola'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return (
        (card.number >= alolaStart && card.number <= alolaEnd && (!card.variant || variantRegions.includes('Alola'))) ||
        variantRegions.includes('Alola')
      );
    },
    carouselCards: ['Rowlet-722', 'Incineroar-727', 'Primarina-730', 'Lycanroc (Dusk)-745', 'Mimikyu-778', 'Tapu Koko-785', 'Nihilego-793', 'Ultra Necrozma-800'],
    chaseCard: 'Ultra Necrozma-800',
  },
  {
    id: 'galar',
    name: 'Galar',
        filter: (card: Card) => {
      const [galarStart, galarEnd] = regionRanges['Galar'] || [0, 0];
      const [hisuiStart, hisuiEnd] = regionRanges['Hisui'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return (
        (card.number >= galarStart && card.number <= galarEnd && (!card.variant || variantRegions.includes('Galar'))) ||
        variantRegions.includes('Hisui') ||
        (hisuiStart !== 0 && !card.variant && card.number >= hisuiStart && card.number <= hisuiEnd)
      );
    },
    carouselCards: ['Grookey-810', 'Cinderace-815', 'Inteleon-818', 'Dragapult-887', 'Zacian (Crowned)-888', 'Urshifu (Single Strike)-892', 'Moltres (Galar)-146', 'Calyrex (Shadow Rider)-898'],
    chaseCard: 'Calyrex (Shadow Rider)-898',
  },
  {
    id: 'paldea',
    name: 'Paldea',
    filter: (card: Card) => {
      const [paldeaStart, paldeaEnd] = regionRanges['Paldea'] || [0, 0];
      const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
      return (
        (card.number >= paldeaStart && card.number <= paldeaEnd && (!card.variant || variantRegions.includes('Paldea') || variantRegions.includes('PaldeaZen'))) ||
        variantRegions.includes('Paldea')
      );
    },
    carouselCards: ['Sprigatito-906', 'Fuecoco-909', 'Quaquaval-914', 'Tinkaton-959', 'Clodsire-980', 'Gholdengo-1000', 'Ogerpon-1017', 'Terapagos (Stellar)-1024'],
    chaseCard: 'Terapagos (Stellar)-1024',
  },
  {
    id: 'conquest',
    name: 'Conquest',
    filter: (card: Card) => {
      const allowedNumbers = [
        133, 134, 135, 136, 196, 197, 470, 471, 280, 281, 282, 475, 129, 130, 172, 25, 26, 194, 195, 174, 39, 40,
        41, 42, 169, 396, 397, 398, 399, 400, 543, 544, 545, 403, 404, 405, 607, 608, 609, 524, 525, 526, 548,
        549, 179, 180, 181, 546, 547, 447, 448, 433, 358, 23, 24, 204, 205, 52, 53, 363, 364, 365, 574, 575,
        576, 551, 552, 553, 355, 356, 477, 517, 518, 522, 523, 147, 148, 149, 246, 247, 248, 374, 375, 376, 443,
        444, 445, 453, 454, 633, 634, 635, 361, 362, 478, 572, 573, 66, 67, 68, 532, 533, 534, 613, 614, 501,
        502, 503, 4, 5, 6, 92, 93, 94, 390, 391, 392, 495, 496, 497, 498, 499, 500, 540, 541, 542, 63, 64, 65,
        252, 253, 254, 393, 394, 395, 511, 512, 513, 514, 515, 516, 554, 555, 610, 611, 612, 595, 596, 304, 305,
        306, 529, 530, 570, 571, 451, 452, 624, 625, 111, 112, 464, 410, 411, 559, 560, 425, 426, 627, 628, 347,
        348, 636, 637, 95, 208, 15, 446, 143, 587, 215, 461, 200, 429, 531, 455, 442, 123, 212, 131, 639, 144,
        379, 383, 483, 150, 643, 644, 493, 384
      ];
      return allowedNumbers.includes(card.number) && !card.variant;
    },
    carouselCards: ['Eevee-133', 'Jigglypuff-39', 'Articuno-144', 'Mewtwo-150', 'Groudon-383', 'Zekrom-644', 'Arceus-493', 'Rayquaza-384'],
    chaseCard: 'Rayquaza-384',
    shinyChase: true,
  },
  {
    id: 'unite',
    name: 'Unite',
    filter: (card: Card) => {
      const allowedNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 35, 36, 37, 38, 39, 40, 54, 66, 67, 68, 77, 78, 79, 80, 84, 85, 92, 93, 94, 122, 129, 130, 131, 143, 147, 148, 149, 150, 151, 183, 184, 133, 196, 197, 123, 212, 113, 242, 245, 246, 247, 248, 250,  255, 256, 257,  280, 281, 282, 302, 358, 374, 375, 376, 380, 381, 443, 444, 445, 448, 470, 471, 220, 221, 473, 491, 557, 558, 570, 571, 607, 608, 609, 653, 654, 655, 656, 657, 658, 661, 662, 663, 679, 680, 681, 700, 704, 705, 706, 708, 709, 720, 722, 723, 724, 761, 762, 763, 764, 778, 794, 807, 813, 814, 815, 816, 817, 818, 819, 820, 829, 830, 845, 868, 869, 870, 884, 885, 886, 887, 888, 891, 892, 906, 907, 908, 935, 936, 937, 957, 958, 959, 1008, 190, 424, 341, 352, 531, 415, 516, 506, 507, 63, 49, 165, 166, 191, 192, 751, 752, 101, 872, 873, 659, 660, 876, 333, 334, 177, 178, 272, 626, 479, 834, 145, 486, 713, 589, 617, 894, 377, 378, 379, 384, 515, 516, 875, 613, 614, 939, 973, 128, 225, 895, 234, 144
      ];
         const nonVariantOnly = [3, 6, 9, 79, 80, 94, 122, 130, 131, 143, 248, 212, 257, 282, 302, 358, 376, 380, 381, 445, 448, 570, 571, 658, 705, 706, 724, 815, 818, 101, 479, 834, 145, 713, 384, 128, 144, 334];
    const variantOnly = [26, 37, 38, 77, 78, 888, 52, 53, 876, 128];
    const allowedVariants = ['Alola', 'Galar', 'Crowned', 'female', 'Combat'];

    return allowedNumbers.includes(card.number) && (
      (nonVariantOnly.includes(card.number) && !card.variant) ||
      (variantOnly.includes(card.number) && allowedVariants.includes(card.variant || '')) ||
      (!nonVariantOnly.includes(card.number) && !variantOnly.includes(card.number))
    );
    },
    carouselCards: ['Pikachu-25', 'Rapidash (Galar)-78', 'Blissey-242', 'Mimikyu-778', 'Darkrai-491', 'Miraidon-1008'],
    chaseCard: '',
  },
  {
    id: 'snap',
    name: 'Snap',
    filter: (card: Card) => {
      const allowedNumbers = [
        666, 172, 810, 813, 626, 18, 465, 587, 265, 198, 10, 214, 127, 85, 580, 581, 399, 276, 389, 129, 163, 765, 671, 415, 416, 700, 492, 154, 133, 25, 742, 659, 508, 396, 52, 531, 19, 568, 185, 702, 190, 11, 267, 24, 193, 731, 733, 168, 755, 289, 3, 510, 194, 195, 260, 166, 816, 470, 151, 677, 275, 352, 585, 586, 521, 780, 674, 1, 497, 840, 760, 282, 38, 270, 196, 251, 350, 278, 103, 739, 426, 335, 336, 182, 686, 771, 68, 618, 224, 222, 456, 366, 730, 26, 769, 319, 7, 9, 131, 226, 279, 321, 747, 134, 490, 370, 594, 320, 346, 457, 211, 693, 73, 170, 171, 121, 592, 768, 249, 746, 451, 27, 328, 330, 115, 630,  774, 843, 255, 695, 745, 450, 248, 95, 334, 403, 405, 663, 391, 142, 697, 75, 567, 218, 324, 4, 6, 157, 136, 250, 637, 162, 613, 614, 262, 461, 628, 220, 473, 227, 460, 37, 225, 872, 873, 740, 361, 362, 478, 124, 363, 393, 584, 713, 87, 699, 471, 245, 169, 595, 74, 703, 94, 714, 710, 453, 425, 35, 302, 409, 706, 303, 135, 719, 208, 229, 830, 177, 359, 757, 715, 527, 561, 606, 623, 609, 197, 385, 716, 285, 590, 143, 160, 357, 54, 217, 529, 173, 130, 50, 744, 758, 498, 558, 472, 545, 109, 317, 807, 709
      ];
         const nonVariantOnly = [194, 38, 103, 52, 618, 27, 211, 25, 19, 18, 6, 3, 460, 628, 133, 319, 74, 75, 706, 127, 214, 94, 302, 303, 492, 282, 815, 359, 248, 719, 362, 208, 222, 142, 143, 9, 131, 260, 115, 130, 334];
    const variantOnly = [26, 28, 37, 716];
    const allowedVariants = ['Alola', 'active', 'lumina'];

    return card.variant !== 'GMax' && card.variant !== 'Mega' && (allowedNumbers.includes(card.number) && (
      (nonVariantOnly.includes(card.number) && !card.variant) ||
      (variantOnly.includes(card.number) && allowedVariants.includes(card.variant || '')) ||
      (!nonVariantOnly.includes(card.number) && !variantOnly.includes(card.number)))
    );
    },
    carouselCards: ['Meganium (Lumina)-154', 'Milotic (Lumina)-350', 'Wishiwashi (Lumina)-746', 'Volcarona (Lumina)-637', 'Steelix (Lumina)-208', 'Xerneas (Lumina)-716'],
    chaseCard: 'Xerneas (Lumina)-716',
  },
  {
    id: 'fossil',
    name: 'Fossil',
    filter: (card: Card) => {
      const allowedNumbers = [
        27, 28, 50, 51, 63, 64, 65, 74, 75, 76, 95, 90, 91, 43, 44, 45, 104, 105, 111, 112, 114, 131, 138, 139, 140, 141, 142, 177, 178, 182, 185, 193, 201, 206, 208, 213, 218, 219, 220, 221, 222, 230, 231, 232, 246, 247, 248, 293, 294, 295, 296, 297, 299, 304, 305, 306, 318, 319, 324, 331, 332, 337, 338, 343, 344, 345, 346, 347, 348, 369, 320, 321, 377, 378, 379, 387, 388, 379, 408, 409, 410, 411, 438, 436, 437, 442, 455, 464, 465, 469, 473, 476, 485, 524, 525, 526, 557, 558, 562, 563, 564, 565, 566, 567, 590, 591, 621, 622, 523, 629, 630, 636, 637, 649, 688, 689, 696, 697, 698, 699, 703, 712, 713, 739, 740, 774, 776, 837, 838, 839, 843, 844, 864, 867, 874, 871, 771, 880, 881, 882, 883, 894, 895, 486, 900, 123, 932, 933, 934, 946, 947, 950, 953, 954, 982, 39, 40, 174, 81, 82, 462, 79, 80, 199, 200, 429, 561
      ];
         const nonVariantOnly = [50, 51];
    const variantOnly = [1];
    const allowedVariants = [''];

    return allowedNumbers.includes(card.number) && (
      (nonVariantOnly.includes(card.number) && !card.variant) ||
      (variantOnly.includes(card.number) && allowedVariants.includes(card.variant || '')) ||
      (!nonVariantOnly.includes(card.number) && !variantOnly.includes(card.number))
    );
    },
    carouselCards: ['Omanyte-138', 'Anorith-347', 'Bastiodon-411', 'Carracosta-565', 'Tyrantrum-697', 'Dracovish-882', 'Mega Aerodactyl-142', 'Regigigas-486', 'Genesect-649'],
    chaseCard: 'Genesect-649',
  },
  {
    id: 'urshifu',
    name: 'Might & Mastery',
    filter: (card: Card) => {
      const allowedNumbers = [
        1, 2, 3, 7, 8, 9, 56, 57, 66, 67, 68, 83, 106, 107, 214, 236, 237, 296, 297, 307, 308, 447, 448, 453, 454, 280, 281, 475, 532, 533, 534, 538, 539, 559, 560, 619, 620, 674,  675, 701, 759, 760, 766, 782, 783, 784, 802, 852, 853, 865, 870, 891, 892, 973, 979, 60, 61, 62, 129, 130, 273, 274, 275, 285, 286, 318, 319, 341, 342, 501, 502, 503, 551, 552, 553, 821, 822, 823, 827, 828, 845, 846, 847, 912, 913, 914,  919, 920, 403, 404, 405, 239, 125, 466, 522, 523, 921, 922, 923, 113, 242, 440, 427, 428, 531, 963, 954, 656, 657, 658, 744, 745
      ];
         const nonVariantOnly = [0];
    const variantOnly = [83];
    const allowedVariants = ['Galar'];

    return allowedNumbers.includes(card.number) && (
      (nonVariantOnly.includes(card.number) && !card.variant) ||
      (variantOnly.includes(card.number) && allowedVariants.includes(card.variant || '')) ||
      (!nonVariantOnly.includes(card.number) && !variantOnly.includes(card.number))
    );
    },
    carouselCards: ['Kubfu-891', 'Urshifu (Single Strike)-892', 'Urshifu (Rapid Strike)-892', 'GMax Urshifu (Single Strike)-892', 'GMax Urshifu (Rapid Strike)-892'],
    chaseCard: '',
  },
  {
    id: 'pokken',
    name: 'Pokkén Tournament',
    filter: (card: Card) => {
      const allowedNumbers = [
        447, 448, 25, 66, 67, 68, 280, 281, 282, 215, 461, 245, 4, 5, 6, 255, 256, 257, 92, 93, 94, 252, 253, 254, 608, 608, 609, 150, 443, 444, 445, 654, 564, 491, 123, 212, 453, 393, 394, 395, 722, 723, 724, 679, 680, 681, 7, 8, 9, 587, 495, 131, 657, 133, 385, 547, 38, 429, 83, 101, 479, 494, 468, 149, 700, 417, 129, 104, 50, 82, 195, 196, 197, 643, 488, 717, 381, 725, 728, 384, 778, 151, 251, 187, 188, 189, 16, 17, 19, 51, 509, 510, 216, 217, 580, 581, 265, 266, 267, 214, 585, 586, 276, 277, 672, 673, 241, 77, 78, 412, 413, 414, 132, 636, 637,664, 665, 666, 590, 591, 74, 75, 650, 118, 119, 193, 469, 480, 481, 482, 285, 286, 273, 274, 275, 21, 22, 335, 127, 128, 642, 113, 242, 440, 559, 560, 311, 312, 202, 360, 190, 424, 58, 59, 88, 89, 582, 583, 584, 572, 573, 425, 426, 568, 569, 595, 596, 39, 40, 174, 531, 237, 109, 110, 309, 310, 96, 97, 19, 20, 446, 678, 659, 660, 333, 334, 648, 293, 294, 295, 125, 239, 466, 108, 463, 543, 544, 545, 183, 184, 298, 258, 259, 260, 122, 439, 566, 567, 41, 42, 169, 142, 324, 218, 219, 383, 485, 302, 632, 714, 715, 629, 630, 696, 697, 704, 705, 706, 371, 372, 373, 627, 628, 235, 303, 676, 519, 520, 521, 186, 60, 61, 418, 419, 175, 176, 315, 406, 407, 143, 313, 314, 492, 613, 614, 363, 364, 365, 615, 712, 713, 86, 87, 532, 533, 534, 361, 698, 699, 459, 460, 220, 221, 423, 478, 144, 209, 210, 234, 39, 40, 35, 36, 173, 174, 702, 707, 167, 168, 200, 352, 353, 354, 708, 709, 355, 356, 477, 487, 527, 528, 710, 711, 163, 164, 655, 172, 52, 53, 270, 271, 272, 331, 332, 296, 297, 458, 226, 130, 278, 279, 158, 159, 160, 651, 652, 223, 224, 250, 561, 436, 437, 287, 288, 289, 320, 321, 115, 574, 575, 576, 524, 525, 526, 496, 497, 81, 82, 462, 357, 674, 675, 147, 148, 538, 539, 504, 505, 622, 523, 349, 350, 555, 449, 450, 213, 328, 329, 330, 562, 563, 201, 343, 344, 236, 62, 106, 107, 56, 57, 307, 308, 325, 326, 701, 454, 498, 499, 500, 427, 428, 100, 433, 358, 619, 620, 420, 421, 669, 670, 671,390, 391, 392, 471, 658, 656, 79, 80, 199,  72, 73, 456, 457, 170, 171, 370, 592, 593, 382, 318, 319, 688, 689, 366, 367, 368, 222, 692, 693, 769, 770, 771, 490, 759, 760, 594, 179, 180, 181, 246, 247, 248, 152, 153, 154, 182, 43, 44, 741, 554, 731, 732, 733, 775, 105, 102, 103, 684, 685, 761, 762, 763, 767, 768, 757, 758
      ];
         const nonVariantOnly = [215, 724, 38, 83, 101, 479, 494, 50, 51, 381, 19, 214, 77, 78, 128, 58, 59, 88, 89, 531, 110, 310, 19, 20, 334, 260, 122, 142, 383, 302, 705, 706, 373, 628, 303, 143, 713, 460, 144, 354, 52, 53, 130, 115, 562, 308, 428, 100, 79, 80, 199, 382, 319, 222, 181, 248, 554];
    const variantOnly = [666, 555, 741];
    const allowedVariants = ['Mega', 'MegaX', 'Shadow', 'MegaShadow', 'libre', 'meadow', 'modern', 'Zen', 'Pau', ''];

    return allowedNumbers.includes(card.number) && (
      card.variant !== 'GMax' && (
        (nonVariantOnly.includes(card.number) && !card.variant) ||
        (variantOnly.includes(card.number) && allowedVariants.includes(card.variant || '')) ||
        (!nonVariantOnly.includes(card.number) && !variantOnly.includes(card.number) && (!card.variant || allowedVariants.includes(card.variant || '')))
      )
    );
  },
    carouselCards: ['Lucario-448', 'Braixen-654', 'Pikachu Libre-25', 'Shadow Mewtwo-150', 'Mega Shadow Mewtwo X-150'],
    chaseCard: 'Mega Shadow Mewtwo X-150',
  },
];