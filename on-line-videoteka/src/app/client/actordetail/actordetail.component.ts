import { Component, OnInit, Inject, Injectable } from '@angular/core';


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FullBioComponent } from './full-bio/full-bio.component';
import { Subscription } from '../../../../node_modules/rxjs';
import { RoleService } from '../../services/roles.service';
import { MovieService, Director } from '../../services/movie.service';
import { RoleOfActor } from '../../models/role.model';
import { ActorService, Directed } from '../../services/actors.service';
import { ParamMap, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Actor } from '../../models/actor.model';
import * as moment from 'moment';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-actordetail',
  templateUrl: './actordetail.component.html',
  styleUrls: ['./actordetail.component.css']
})
@Injectable()
export class ActordetailComponent implements OnInit {
  isLoading = true;
  // tslint:disable-next-line:max-line-length
  actorBioFull = 'Robert John Downey, Jr. (born April 4, 1965) is an American actor. Downey made his screen debut in 1970, at the age of five, when he appeared in his father\'s film Pound,and has worked consistently in film and television ever since.  During the 1980s he had roles in a series of coming of age films associated with the Brat Pack. Less Than Zero (1987)is particularly notable, not only because it was the first time Downey\'s acting would be acknowledged by critics, but also because the role pushed Downey\'s already existing drug habit one step further. After Zero, Downey started landing roles in bigger films such as Air America (1990), Soapdish (1991) and Natural Born Killers (1994). He played Charlie Chaplin in the 1992 film Chaplin, for which he received an Academy Award nomination for Best Actor.';
  actorBio = 'test';

  actor: Actor;
  roles: RoleOfActor[];
  directed: Directed[];

  roleSub: Subscription;
  directorsSub: Subscription;

  born: string;
  died: string;

  constructor(public dialog: MatDialog, private roleService: RoleService, private actorService: ActorService,
    private route: ActivatedRoute) {  }

  ngOnInit() {

    this.roleSub = this.roleService.getrolesOfActorUpdatedListener().subscribe(
      (roleData) => {
        this.roles = roleData.roles;
        console.log(this.roles);
      }
    );
    this.directorsSub = this.actorService.getDirectedUpdatedListener().subscribe(
      (directedData) => {
        this.directed = directedData.directed;
        console.log(this.directed);
      }
    );
    this.route.paramMap.subscribe((param: ParamMap) => {
      console.log(param.get('actorId'));
      if (param.has('actorId')) {
        this.actorService.getActor(param.get('actorId')).subscribe(
          actorData => {
            console.log(actorData);
            const actor: Actor = {
              id: actorData._id,
              born: actorData.born,
              died: actorData.died,
              firstName: actorData.firstName,
              lastName: actorData.lastName,
              ocupations: actorData.ocupations,
              roles: actorData.roles,
              directed: actorData.roles,
              bio: actorData.bio,
              portraitPath: actorData.portraitPath
            };
            this.actor = actor;
            this.born = moment(this.actor.born).format('ll');
            this.died = moment(this.actor.died).format('ll');
            this.actorService.getActorDirected(this.actor.id);
            this.roleService.getRolesForActor(this.actor.id);
            this.isLoading = false;
            if (this.actor.bio.length > 500) {
              this.actorBio = this.actor.bio.substring(0, 500) + '...';
            }
          }
        );
      }
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FullBioComponent, { data: { bio: this.actor.bio }, maxHeight: '500px'});
  }

}


