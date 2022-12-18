// got mega sick of waiting for the path finder bfs to run
// precompute all the paths we're gonna need
export const examplePreComputedPathsCache = {
  "AA->HH": 5,
  "HH->JJ": 7,
  "JJ->DD": 3,
  "DD->BB": 2,
  "BB->EE": 3,
  "EE->CC": 2,
  "BB->CC": 1,
  "CC->EE": 2,
  "DD->EE": 1,
  "EE->BB": 3,
  "DD->CC": 1,
  "CC->BB": 1,
  "JJ->BB": 3,
  "BB->DD": 2,
  "CC->DD": 1,
  "JJ->EE": 4,
  "EE->DD": 1,
  "JJ->CC": 4,
  "HH->DD": 4,
  "DD->JJ": 3,
  "BB->JJ": 3,
  "EE->JJ": 4,
  "CC->JJ": 4,
  "HH->BB": 6,
  "HH->EE": 3,
  "HH->CC": 5,
  "AA->JJ": 2,
  "JJ->HH": 7,
  "DD->HH": 4,
  "BB->HH": 6,
  "EE->HH": 3,
  "CC->HH": 5,
  "AA->DD": 1,
  "AA->BB": 1,
  "AA->EE": 2,
  "AA->CC": 2,
};

export const preComputedPathsCache = {
  "AA->HM": 8,
  "HM->SJ": 12,
  "SJ->IN": 13,
  "HM->IN": 2,
  "IN->SJ": 13,
  "SJ->YR": 10,
  "IN->YR": 11,
  "YR->SJ": 10,
  "IN->YO": 2,
  "YO->SJ": 11,
  "YO->YR": 9,
  "YO->LR": 2,
  "LR->SJ": 12,
  "YO->CY": 9,
  "CY->SJ": 10,
  "YO->KD": 3,
  "KD->SJ": 14,
  "YO->KC": 5,
  "KC->SJ": 6,
  "KC->YR": 10,
  "YO->VQ": 8,
  "VQ->SJ": 3,
  "VQ->YR": 7,
  "YO->PD": 2,
  "PD->SJ": 9,
  "PD->YR": 9,
  "PD->LR": 3,
  "PD->CY": 9,
  "PD->KD": 5,
  "PD->KC": 3,
  "PD->VQ": 6,
  "PD->NU": 2,
  "NU->SJ": 9,
  "PD->KX": 8,
  "KX->SJ": 9,
  "PD->MX": 7,
  "MX->SJ": 8,
  "PD->QI": 8,
  "QI->SJ": 9,
  "YO->NU": 2,
  "NU->YR": 7,
  "NU->LR": 3,
  "NU->CY": 7,
  "NU->KD": 5,
  "NU->KC": 3,
  "NU->VQ": 6,
  "NU->PD": 2,
  "NU->KX": 6,
  "NU->MX": 5,
  "NU->QI": 6,
  "YO->KX": 8,
  "YO->MX": 7,
  "YO->QI": 8,
  "IN->LR": 4,
  "IN->CY": 11,
  "IN->KD": 5,
  "IN->KC": 7,
  "IN->VQ": 10,
  "IN->PD": 4,
  "PD->YO": 2,
  "IN->NU": 4,
  "NU->YO": 2,
  "IN->KX": 10,
  "IN->MX": 9,
  "IN->QI": 10,
  "HM->YR": 12,
  "HM->YO": 4,
  "YO->IN": 2,
  "KC->IN": 7,
  "VQ->IN": 10,
  "PD->IN": 4,
  "NU->IN": 4,
  "HM->LR": 6,
  "LR->IN": 4,
  "LR->YR": 10,
  "LR->YO": 2,
  "LR->CY": 10,
  "LR->KD": 3,
  "LR->KC": 6,
  "LR->VQ": 9,
  "LR->PD": 3,
  "LR->NU": 3,
  "LR->KX": 9,
  "LR->MX": 8,
  "LR->QI": 9,
  "HM->CY": 12,
  "HM->KD": 7,
  "HM->KC": 6,
  "KC->YO": 5,
  "KC->LR": 6,
  "KC->CY": 10,
  "KC->KD": 8,
  "KC->VQ": 3,
  "KC->PD": 3,
  "KC->NU": 3,
  "KC->KX": 9,
  "KC->MX": 8,
  "KC->QI": 9,
  "HM->VQ": 9,
  "HM->PD": 3,
  "HM->NU": 5,
  "HM->KX": 11,
  "HM->MX": 10,
  "MX->IN": 9,
  "HM->QI": 11,
  "AA->SJ": 6,
  "SJ->HM": 12,
  "IN->HM": 2,
  "YR->HM": 12,
  "SJ->YO": 11,
  "YO->HM": 4,
  "LR->HM": 6,
  "CY->HM": 12,
  "KD->HM": 7,
  "KC->HM": 6,
  "VQ->HM": 9,
  "PD->HM": 3,
  "NU->HM": 5,
  "KX->HM": 11,
  "MX->HM": 10,
  "QI->HM": 11,
  "SJ->LR": 12,
  "SJ->CY": 10,
  "SJ->KD": 14,
  "SJ->KC": 6,
  "VQ->YO": 8,
  "VQ->LR": 9,
  "VQ->CY": 7,
  "VQ->KD": 11,
  "SJ->VQ": 3,
  "VQ->KC": 3,
  "VQ->PD": 6,
  "VQ->NU": 6,
  "VQ->KX": 6,
  "VQ->MX": 5,
  "MX->YR": 2,
  "MX->YO": 7,
  "MX->LR": 8,
  "MX->CY": 2,
  "MX->KD": 10,
  "MX->KC": 8,
  "MX->PD": 7,
  "MX->NU": 5,
  "MX->KX": 3,
  "MX->QI": 3,
  "VQ->QI": 6,
  "SJ->PD": 9,
  "SJ->NU": 9,
  "SJ->KX": 9,
  "KX->IN": 10,
  "KX->YR": 5,
  "KX->YO": 8,
  "KX->LR": 9,
  "KX->CY": 3,
  "KX->KD": 11,
  "KX->KC": 9,
  "KX->VQ": 6,
  "KX->PD": 8,
  "KX->NU": 6,
  "KX->MX": 3,
  "KX->QI": 2,
  "SJ->MX": 8,
  "MX->VQ": 5,
  "SJ->QI": 9,
  "QI->IN": 10,
  "QI->YR": 3,
  "QI->YO": 8,
  "QI->LR": 9,
  "QI->CY": 2,
  "QI->KD": 11,
  "QI->KC": 9,
  "QI->VQ": 6,
  "QI->PD": 8,
  "QI->NU": 6,
  "QI->KX": 2,
  "QI->MX": 3,
  "AA->IN": 7,
  "KD->YR": 12,
  "KD->YO": 3,
  "KD->LR": 3,
  "KD->CY": 12,
  "KD->KC": 8,
  "KD->VQ": 11,
  "KD->PD": 5,
  "KD->NU": 5,
  "KD->KX": 11,
  "KD->MX": 10,
  "KD->QI": 11,
  "AA->YR": 4,
  "YR->IN": 11,
  "YR->YO": 9,
  "YR->LR": 10,
  "YR->CY": 2,
  "CY->IN": 11,
  "CY->YO": 9,
  "CY->LR": 10,
  "CY->KD": 12,
  "CY->KC": 10,
  "CY->VQ": 7,
  "CY->PD": 9,
  "CY->NU": 7,
  "CY->KX": 3,
  "CY->MX": 2,
  "CY->QI": 2,
  "YR->KD": 12,
  "YR->KC": 10,
  "YR->VQ": 7,
  "YR->PD": 9,
  "YR->NU": 7,
  "YR->KX": 5,
  "YR->MX": 2,
  "YR->QI": 3,
  "AA->YO": 5,
  "KD->IN": 5,
  "CY->YR": 2,
  "AA->LR": 6,
  "AA->CY": 4,
  "AA->KD": 8,
  "AA->KC": 6,
  "AA->VQ": 3,
  "AA->PD": 5,
  "AA->NU": 3,
  "AA->KX": 3,
  "AA->MX": 2,
  "AA->QI": 3,
};