import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import {MatDialog } from '@angular/material';
import { FullBioComponent } from './full-bio/full-bio.component';
import { Subscription } from '../../../../node_modules/rxjs';
import { RoleService } from '../../services/roles.service';
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
export class ActordetailComponent implements OnInit, OnDestroy {
  isLoading = true;
  actorBio = '...';
  actorBioFull = '';
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
            this.actorBioFull = this.actor.bio;

            if (this.actor.bio.length > 500) {
              this.actorBio = this.actor.bio.substring(0, 500) + '...';
            } else {
              this.actorBio = this.actor.bio;
            }
          }
        );
      }
    });

  }

  openDialog(): void {
    this.dialog.open(FullBioComponent, { data: { bio: this.actor.bio }, maxHeight: '500px'});
  }

  ngOnDestroy() {
    this.directorsSub.unsubscribe();
    this.roleSub.unsubscribe();
  }
}


