import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-actordetail',
  templateUrl: './actordetail.component.html',
  styleUrls: ['./actordetail.component.css']
})
export class ActordetailComponent implements OnInit {

  actotBioFull = 'Robert John Downey, Jr. (born April 4, 1965) is an American actor. Downey made his screen debut in 1970, at the age of five, when he appeared in his father\'s film Pound,and has worked consistently in film and television ever since.  During the 1980s he had roles in a series of coming of age films associated with the Brat Pack. Less Than Zero (1987)is particularly notable, not only because it was the first time Downey\'s acting would be acknowledged by critics, but also because the role pushed Downey\'s already existing drug habit one step further. After Zero, Downey started landing roles in bigger films such as Air America (1990), Soapdish (1991) and Natural Born Killers (1994). He played Charlie Chaplin in the 1992 film Chaplin, for which he received an Academy Award nomination for Best Actor.'
  actorBio = 'test';
  constructor() {

  }

  ngOnInit() {
    if (this.actotBioFull.length > 500) {
      this.actorBio = this.actotBioFull.substring(0, 500) + '...';
    }
  }



}

